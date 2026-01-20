import axios from 'axios';

const API_KEY = process.env.EXPO_PUBLIC_SPOONACULAR_API_KEY;
const BASE_URL = process.env.EXPO_PUBLIC_SPOONACULAR_BASE_URL;

// Haram ingredients to ALWAYS exclude from recipes (Islamic dietary laws)
export const HARAM_INGREDIENTS = [
  // Pork products
  'pork',
  'bacon',
  'ham',
  'prosciutto',
  'pancetta',
  'lard',
  'pork chops',
  'pork belly',
  'pork sausage',
  'chorizo',
  'pepperoni',
  'salami',
  'mortadella',
  'guanciale',

  // Alcohol
  'wine',
  'beer',
  'rum',
  'vodka',
  'whiskey',
  'brandy',
  'sake',
  'champagne',
  'sherry',
  'port wine',
  'liqueur',
  'tequila',
  'gin',
  'cognac',
  'bourbon',
  'alcohol',
  'liquor',
  'red wine',
  'white wine',
  'cooking wine',
  'marsala',
  'amaretto',
  'kahlua',
  'baileys',
];

// Map category names to Spoonacular cuisine names
const categoryToCuisine: Record<string, string> = {
  All: 'All',
  Indian: 'indian',
  Italian: 'italian',
  Asian: 'asian',
  Chinese: 'chinese',
  Mexican: 'mexican',
};

// Fetch recipes (random or by cuisine)
export const fetchRecipesByCategory = async (
  cuisine: string = 'All',
  number: number = 10,
  filters?: {
    diet?: string[];
    excludeIngredients?: string[];
  }
) => {
  try {
    let url = '';

    // Always exclude haram ingredients + merge with user-provided exclusions
    const allExcludedIngredients = [
      ...HARAM_INGREDIENTS,
      ...(filters?.excludeIngredients || []),
    ];

    let params: any = {
      apiKey: API_KEY,
      number,
      excludeIngredients: allExcludedIngredients.join(','), // Always exclude haram ingredients
    };

    // Add diet and intolerance filters
    if (filters?.diet && filters.diet.length > 0) {

      const knownDiets = ['vegetarian', 'vegan', 'pescatarian', 'paleo', 'primal', 'ketogenic', 'whole30'];
      const knownIntolerances = ['gluten', 'dairy', 'egg', 'soy', 'peanut', 'tree nut', 'seafood', 'shellfish', 'wheat', 'sesame', 'sulfite'];

      const activeDiets: string[] = [];
      const activeIntolerances: string[] = [];

      filters.diet.forEach(d => {
        const lower = d.toLowerCase();

        if (lower === 'keto') {
          activeDiets.push('ketogenic');
        } else if (lower.includes('fish') && !lower.includes('shellfish')) {
          activeIntolerances.push('seafood');
        } else if (knownDiets.includes(lower)) {
          activeDiets.push(lower);
        } else if (knownIntolerances.includes(lower)) {
          activeIntolerances.push(lower);
        } else {
          if (lower.includes('gluten')) activeIntolerances.push('gluten');
          else if (lower.includes('dairy')) activeIntolerances.push('dairy');
          else if (lower.includes('egg')) activeIntolerances.push('egg');
          else if (lower.includes('soy')) activeIntolerances.push('soy');
          else if (lower.includes('peanut')) activeIntolerances.push('peanut');
          else if (lower.includes('tree nut') || lower.includes('treenut')) activeIntolerances.push('tree nut');
          else if (lower.includes('shellfish')) activeIntolerances.push('shellfish');
          else if (lower.includes('wheat')) activeIntolerances.push('wheat');
        }
      });

      if (activeDiets.length > 0) {
        const dietString = activeDiets.join(',');
        params.tags = dietString; // For random
        params.diet = dietString; // For complexSearch
      }

      if (activeIntolerances.length > 0) {
        params.intolerances = activeIntolerances.join(',');
      }
    }

    const mappedCuisine = categoryToCuisine[cuisine] || cuisine;

    if (mappedCuisine === 'All') {
      // Use complexSearch with sort=random instead of random endpoint to support excludeIngredients
      url = `${BASE_URL}/recipes/complexSearch`;
      params = {
        ...params,
        sort: 'random',
        addRecipeInformation: true,
      };

      if (params.tags && !params.diet) {
        params.diet = params.tags; // complexSearch uses 'diet', random used 'tags'
        delete params.tags;
      }

      // params.excludeIngredients is already set above correctly

      console.log('🔍 params for random (via complexSearch):', JSON.stringify(params));
      const response = await axios.get(url, { params });
      return { results: response.data.results || [] }; // normalize to object with results
    } else {
      // Fetch filtered recipes first
      url = `${BASE_URL}/recipes/complexSearch`;
      params.cuisine = mappedCuisine;
      params.addRecipeInformation = true;
      params.number = 50; // Fetch more to shuffle from

      // For complexSearch, 'tags' is not used for diet, 'diet' parameter is used
      if (params.tags && !params.diet) {
        params.diet = params.tags;
        delete params.tags;
      }

      console.log('🔍 params for complexSearch:', JSON.stringify(params));
      const response = await axios.get(url, { params });
      const allResults = response.data.results || [];

      const randomSubset = shuffleArray(allResults).slice(0, number);

      return { results: randomSubset };
    }
  } catch (error) {
    console.log('Error fetching recipes:', error);
    throw error;
  }
};

// Fisher-Yates Shuffle to get stronger randomness
export const shuffleArray = (array: any[]) => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};

// Fetch recipes by ingredients
export const fetchRecipesByIngredients = async (
  ingredients: string[] | string,
  number: number = 10
) => {
  try {
    const url = `${BASE_URL}/recipes/findByIngredients`;

    // Convert array to comma-separated string if it's an array
    const ingredientsString = Array.isArray(ingredients) ? ingredients.join(',') : ingredients;

    const params = {
      apiKey: API_KEY,
      ingredients: ingredientsString,
      number: number,
      ranking: 2, // 1 = maximize used ingredients, 2 = minimize missing ingredients
      ignorePantry: true, // Ignore typical pantry items
      excludeIngredients: HARAM_INGREDIENTS.join(','), // Always exclude haram ingredients
    };

    const response = await axios.get(url, { params });

    // Shuffle the results for randomness
    const shuffledResults = shuffleArray(response.data);

    return shuffledResults;
  } catch (error) {
    console.log('Error fetching recipes by ingredients:', error);
    throw error;
  }
};

// Fetch a single recipe by its Spoonacular API ID
export const fetchRecipeApiById = async (recipeId: string | number) => {
  try {
    const url = `${BASE_URL}/recipes/${recipeId}/information`;
    const params = {
      apiKey: API_KEY,
      includeNutrition: true, // Optional, include nutrition info if needed
    };

    const response = await axios.get(url, { params });

    // Return the recipe data
    return response.data;
  } catch (error) {
    console.log(`Error fetching recipe by ID (${recipeId}):`, error);
    throw error;
  }
};

// Fetch random recipes with robust filtering using complexSearch
export const fetchRandomRecipes = async (
  number: number = 10,
  filters?: {
    diet?: string[];
    excludeIngredients?: string[];
  }
) => {
  try {
    // We use complexSearch instead of random endpoint to support excludeIngredients
    const url = `${BASE_URL}/recipes/complexSearch`;

    // Always exclude haram ingredients + merge with user-provided exclusions
    const allExcludedIngredients = [
      ...HARAM_INGREDIENTS,
      ...(filters?.excludeIngredients || []),
    ];

    const params: any = {
      apiKey: API_KEY,
      number,
      sort: 'random', // Key to making complexSearch behave like random
      addRecipeInformation: true, // Need full recipe info
      excludeIngredients: allExcludedIngredients.join(','),
    };

    // Add diet and intolerance filters
    if (filters?.diet && filters.diet.length > 0) {

      const knownDiets = ['vegetarian', 'vegan', 'pescatarian', 'paleo', 'primal', 'ketogenic', 'whole30'];
      const knownIntolerances = ['gluten', 'dairy', 'egg', 'soy', 'peanut', 'tree nut', 'seafood', 'shellfish', 'wheat', 'sesame', 'sulfite'];

      const activeDiets: string[] = [];
      const activeIntolerances: string[] = [];

      filters.diet.forEach(d => {
        const lower = d.toLowerCase();

        // Map UI terms to API terms
        if (lower === 'keto') {
          activeDiets.push('ketogenic');
        } else if (lower.includes('fish') && !lower.includes('shellfish')) {
          activeIntolerances.push('seafood');
        } else if (lower === 'low-carb') {
          // Spoonacular doesn't have a direct 'low-carb' diet param
        } else if (knownDiets.includes(lower)) {
          activeDiets.push(lower);
        } else if (knownIntolerances.includes(lower)) {
          activeIntolerances.push(lower);
        } else {
          // Check mapped values or edge cases
          if (lower.includes('gluten')) activeIntolerances.push('gluten');
          else if (lower.includes('dairy')) activeIntolerances.push('dairy');
          else if (lower.includes('egg')) activeIntolerances.push('egg');
          else if (lower.includes('soy')) activeIntolerances.push('soy');
          else if (lower.includes('peanut')) activeIntolerances.push('peanut');
          else if (lower.includes('tree nut') || lower.includes('treenut')) activeIntolerances.push('tree nut');
          else if (lower.includes('shellfish')) activeIntolerances.push('shellfish');
          else if (lower.includes('wheat')) activeIntolerances.push('wheat');
        }
      });

      if (activeDiets.length > 0) {
        params.diet = activeDiets.join(',');
      }

      if (activeIntolerances.length > 0) {
        params.intolerances = activeIntolerances.join(',');
      }
    }

    console.log('🔍 Fetching random recipes (via complexSearch) with params:', JSON.stringify(params));

    const response = await axios.get(url, { params });

    console.log(`Found ${response.data.results?.length || 0} recipes`);

    // complexSearch returns { results: [...] }, strictly simpler than random endpoint's { recipes: [...] }
    return response.data.results || [];
  } catch (error) {
    console.log('Error fetching random recipes:', error);
    throw error;
  }
};

// Fetch a single recipe by ID from Spoonacular
export const fetchRecipeById = async (recipeId: string) => {
  try {
    const apiKey = process.env.EXPO_PUBLIC_SPOONACULAR_API_KEY;
    const url = `https://api.spoonacular.com/recipes/${recipeId}/information?apiKey=${apiKey}`;

    const response = await fetch(url);
    const data = await response.json();

    console.log('✅ Recipe fetched by ID:', data.title);
    return data;
  } catch (error) {
    console.log('❌ Error fetching recipe by ID:', error);
    return null;
  }
};
