import { useMutation } from "@tanstack/react-query";

export const openfoodfacts = {
  useGetProductByBarcode: () => {
    const headers: HeadersInit = {
      "User-Agent": "Surf/0.1.0 (hola@salutmercado.com)",
    };
    if (import.meta.env.DEV) {
      headers.Authorization = "Basic " + btoa("off:off");
    }
    return useMutation({
      mutationKey: ["openfoodfacts", "getProductByBarcode"],
      mutationFn: (barcode: string) => {
        const url = `https://world.openfoodfacts.${import.meta.env.DEV ? "net" : "org"}/api/v2/product/${barcode}.json`;
        return fetch(url, { headers })
          .then((res) => res.json() as Promise<FoodFacts>)
          .catch((err) => {
            console.error(err);
            return null;
          });
      },
    });
  },
};

export interface FoodFacts {
  code: string;
  product: FoodFactsProduct;
  status: number;
  status_verbose: string;
}

export interface FoodFactsProduct {
  _id: string;
  _keywords: string[];
  added_countries_tags: unknown[];
  additives_n: number;
  additives_original_tags: string[];
  additives_tags: string[];
  allergens: string;
  allergens_from_ingredients: string;
  allergens_from_user: string;
  allergens_hierarchy: string[];
  allergens_lc: string;
  allergens_tags: string[];
  amino_acids_tags: unknown[];
  brands: string;
  brands_old: string;
  brands_tags: string[];
  categories: string;
  categories_hierarchy: string[];
  categories_lc: string;
  categories_old: string;
  categories_properties: CategoriesProperties;
  categories_properties_tags: string[];
  categories_tags: string[];
  category_properties: CategoryProperties;
  checkers_tags: unknown[];
  ciqual_food_name_tags: string[];
  cities_tags: unknown[];
  code: string;
  codes_tags: string[];
  compared_to_category: string;
  complete: number;
  completeness: number;
  correctors_tags: string[];
  countries: string;
  countries_hierarchy: string[];
  countries_imported: string;
  countries_lc: string;
  countries_tags: string[];
  created_t: number;
  creator: string;
  data_quality_bugs_tags: unknown[];
  data_quality_errors_tags: unknown[];
  data_quality_info_tags: string[];
  data_quality_tags: string[];
  data_quality_warnings_tags: string[];
  data_sources: string;
  data_sources_imported: string;
  data_sources_tags: string[];
  debug_param_sorted_langs: string[];
  ecoscore_data: EcoscoreData;
  ecoscore_grade: EcoscoreGrade;
  ecoscore_score: number;
  ecoscore_tags: EcoscoreGrade[];
  editors_tags: string[];
  emb_codes: string;
  emb_codes_tags: string[];
  entry_dates_tags: string[];
  expiration_date: string;
  food_groups: string;
  food_groups_tags: string[];
  generic_name: string;
  generic_name_en: string;
  generic_name_es: string;
  generic_name_pt: string;
  id: string;
  image_front_small_url: string;
  image_front_thumb_url: string;
  image_front_url: string;
  image_ingredients_small_url: string;
  image_ingredients_thumb_url: string;
  image_ingredients_url: string;
  image_nutrition_small_url: string;
  image_nutrition_thumb_url: string;
  image_nutrition_url: string;
  image_small_url: string;
  image_thumb_url: string;
  image_url: string;
  images: Images;
  informers_tags: string[];
  ingredients: Ingredient[];
  ingredients_analysis: IngredientsAnalysis;
  ingredients_analysis_tags: string[];
  ingredients_from_palm_oil_tags: unknown[];
  ingredients_hierarchy: string[];
  ingredients_lc: string;
  ingredients_n: number;
  ingredients_n_tags: string[];
  ingredients_non_nutritive_sweeteners_n: number;
  ingredients_original_tags: string[];
  ingredients_percent_analysis: number;
  ingredients_sweeteners_n: number;
  ingredients_tags: string[];
  ingredients_text: string;
  ingredients_text_en: string;
  ingredients_text_es: string;
  ingredients_text_pt: string;
  ingredients_text_with_allergens: string;
  ingredients_text_with_allergens_en: string;
  ingredients_text_with_allergens_es: string;
  ingredients_text_with_allergens_pt: string;
  ingredients_that_may_be_from_palm_oil_tags: unknown[];
  ingredients_with_specified_percent_n: number;
  ingredients_with_specified_percent_sum: number;
  ingredients_with_unspecified_percent_n: number;
  ingredients_with_unspecified_percent_sum: number;
  ingredients_without_ciqual_codes: string[];
  ingredients_without_ciqual_codes_n: number;
  ingredients_without_ecobalyse_ids: string[];
  ingredients_without_ecobalyse_ids_n: number;
  interface_version_created: string;
  interface_version_modified: string;
  known_ingredients_n: number;
  labels: string;
  labels_hierarchy: string[];
  labels_lc: string;
  labels_old: string;
  labels_tags: string[];
  lang: string;
  languages: Languages;
  languages_codes: LanguagesCodes;
  languages_hierarchy: string[];
  languages_tags: string[];
  last_edit_dates_tags: string[];
  last_editor: string;
  last_image_dates_tags: string[];
  last_image_t: number;
  last_modified_by: string;
  last_modified_t: number;
  last_updated_t: number;
  lc: string;
  lc_imported: string;
  link: string;
  main_countries_tags: unknown[];
  manufacturing_places: string;
  manufacturing_places_tags: string[];
  max_imgid: string;
  minerals_tags: unknown[];
  misc_tags: string[];
  no_nutrition_data: string;
  nova_group: number;
  nova_group_debug: string;
  nova_groups: string;
  nova_groups_markers: { [key: string]: Array<string[]> };
  nova_groups_tags: string[];
  nucleotides_tags: unknown[];
  nutrient_levels: NutrientLevels;
  nutrient_levels_tags: string[];
  nutriments: Nutriments;
  nutriscore: { [key: string]: Nutriscore };
  nutriscore_2021_tags: EcoscoreGrade[];
  nutriscore_2023_tags: EcoscoreGrade[];
  nutriscore_data: NutriscoreData;
  nutriscore_grade: EcoscoreGrade;
  nutriscore_score: number;
  nutriscore_score_opposite: number;
  nutriscore_tags: EcoscoreGrade[];
  nutriscore_version: string;
  nutrition_data: string;
  nutrition_data_per: string;
  nutrition_data_per_imported: string;
  nutrition_data_prepared: string;
  nutrition_data_prepared_per: string;
  nutrition_data_prepared_per_imported: string;
  nutrition_grade_fr: EcoscoreGrade;
  nutrition_grades: EcoscoreGrade;
  nutrition_grades_tags: EcoscoreGrade[];
  nutrition_score_beverage: number;
  nutrition_score_debug: string;
  nutrition_score_warning_fruits_vegetables_legumes_estimate_from_ingredients: number;
  nutrition_score_warning_fruits_vegetables_legumes_estimate_from_ingredients_value: number;
  nutrition_score_warning_fruits_vegetables_nuts_estimate_from_ingredients: number;
  nutrition_score_warning_fruits_vegetables_nuts_estimate_from_ingredients_value: number;
  obsolete: string;
  obsolete_since_date: string;
  origin: string;
  origin_en: string;
  origin_es: string;
  origin_pt: string;
  origins: string;
  origins_hierarchy: unknown[];
  origins_lc: string;
  origins_old: string;
  origins_tags: unknown[];
  other_nutritional_substances_tags: unknown[];
  packaging: string;
  packaging_hierarchy: unknown[];
  packaging_lc: string;
  packaging_materials_tags: string[];
  packaging_old: string;
  packaging_recycling_tags: string[];
  packaging_shapes_tags: string[];
  packaging_tags: unknown[];
  packaging_text: string;
  packaging_text_en: string;
  packaging_text_es: string;
  packaging_text_pt: string;
  packagings: ProductPackaging[];
  packagings_complete: number;
  packagings_materials: PackagingsMaterials;
  packagings_n: number;
  photographers_tags: string[];
  pnns_groups_1: string;
  pnns_groups_1_tags: string[];
  pnns_groups_2: string;
  pnns_groups_2_tags: string[];
  popularity_key: number;
  popularity_tags: string[];
  product: AllClass;
  product_name: string;
  product_name_en: string;
  product_name_es: string;
  product_name_pt: string;
  product_quantity: string;
  product_quantity_unit: Unit;
  product_type: string;
  purchase_places: string;
  purchase_places_tags: unknown[];
  quantity: string;
  removed_countries_tags: unknown[];
  rev: number;
  scans_n: number;
  schema_version: number;
  selected_images: SelectedImages;
  serving_quantity: string;
  serving_quantity_unit: Unit;
  serving_size: string;
  sortkey: number;
  sources: Source[];
  states: string;
  states_hierarchy: string[];
  states_tags: string[];
  stores: string;
  stores_tags: string[];
  taxonomies_enhancer_tags: string[];
  traces: string;
  traces_from_ingredients: string;
  traces_from_user: string;
  traces_hierarchy: string[];
  traces_lc: string;
  traces_tags: string[];
  unique_scans_n: number;
  unknown_ingredients_n: number;
  unknown_nutrients_tags: unknown[];
  update_key: string;
  vitamins_tags: unknown[];
  weighers_tags: unknown[];
}

export interface CategoriesProperties {
  "agribalyse_proxy_food_code:en": string;
  "ciqual_food_code:en": string;
}

export interface CategoryProperties {
  "ciqual_food_name:en": string;
  "ciqual_food_name:fr": string;
}

export interface EcoscoreData {
  adjustments: Adjustments;
  agribalyse: Agribalyse;
  grade: EcoscoreGrade;
  grades: { [key: string]: EcoscoreGrade };
  missing: Missing;
  missing_data_warning: number;
  previous_data: PreviousData;
  score: number;
  scores: { [key: string]: number };
  status: string;
}

export interface Adjustments {
  origins_of_ingredients: OriginsOfIngredients;
  packaging: AdjustmentsPackaging;
  production_system: ProductionSystem;
  threatened_species: AllClass;
}

export interface OriginsOfIngredients {
  aggregated_origins: AggregatedOrigin[];
  epi_score: number;
  epi_value: number;
  origins_from_categories: string[];
  origins_from_origins_field: string[];
  transportation_score: number;
  transportation_scores: { [key: string]: number };
  transportation_value: number;
  transportation_values: { [key: string]: number };
  value: number;
  values: { [key: string]: number };
  warning: string;
}

export interface AggregatedOrigin {
  epi_score: number;
  origin: string;
  percent: number;
  transportation_score: number;
}

export interface AdjustmentsPackaging {
  non_recyclable_and_non_biodegradable_materials: number;
  packagings: PackagingPackaging[];
  score: number;
  value: number;
  warning: string;
}

export interface PackagingPackaging {
  environmental_score_material_score: number;
  environmental_score_shape_ratio: number;
  material: string;
  non_recyclable_and_non_biodegradable?: Vegan;
  number_of_units: number;
  recycling: string;
  shape: string;
}

export enum Vegan {
  Maybe = "maybe",
  No = "no",
  Yes = "yes",
}

export interface ProductionSystem {
  labels: unknown[];
  value: number;
  warning: string;
}

export interface AllClass {
  [key: string]: unknown;
}

export interface Agribalyse {
  agribalyse_proxy_food_code: string;
  co2_agriculture: number;
  co2_consumption: number;
  co2_distribution: number;
  co2_packaging: number;
  co2_processing: number;
  co2_total: number;
  co2_transportation: number;
  code: string;
  dqr: string;
  ef_agriculture: number;
  ef_consumption: number;
  ef_distribution: number;
  ef_packaging: number;
  ef_processing: number;
  ef_total: number;
  ef_transportation: number;
  is_beverage: number;
  name_en: string;
  name_fr: string;
  score: number;
  version: string;
}

export enum EcoscoreGrade {
  D = "d",
}

export interface Missing {
  labels: number;
  origins: number;
  packagings: number;
}

export interface PreviousData {
  agribalyse: Agribalyse;
  grade: EcoscoreGrade;
  score: number;
}

export interface Images {
  "2": The12;
  "3": The12;
  "4": The12;
  "5": The12;
  "6": The12;
  "7": The12;
  "8": The12;
  "9": The12;
  "12": The12;
  "14": The12;
  "15": The12;
  front_es: Es;
  front_pt: FrontPt;
  ingredients_es: FrontPt;
  ingredients_pt: FrontPt;
  nutrition_es: Es;
  nutrition_pt: FrontPt;
}

export interface The12 {
  sizes: Sizes;
  uploaded_t: number;
  uploader: string;
}

export interface Sizes {
  "100": The100;
  "400": The100;
  full: The100;
  "200"?: The100;
}

export interface The100 {
  h: number;
  w: number;
}

export interface Es {
  imgid: string;
  rev: string;
  sizes: Sizes;
}

export interface FrontPt {
  coordinates_image_size: string;
  imgid: string;
  rev: string;
  sizes: Sizes;
  x1: number;
  x2: number;
  y1: number;
  y2: number;
}

export interface Ingredient {
  ciqual_proxy_food_code?: string;
  ecobalyse_code?: string;
  id: string;
  is_in_taxonomy: number;
  percent_estimate: number;
  percent_max: number;
  percent_min: number;
  processing?: string;
  text: string;
  vegan?: Vegan;
  vegetarian?: Vegan;
  percent?: number;
  ciqual_food_code?: string;
  ingredients?: Ingredient[];
}

export interface IngredientsAnalysis {
  "en:non-vegan": string[];
  "en:palm-oil-content-unknown": string[];
  "en:vegan-status-unknown": string[];
  "en:vegetarian-status-unknown": string[];
}

export interface Languages {
  "en:english": number;
  "en:portuguese": number;
  "en:spanish": number;
}

export interface LanguagesCodes {
  en: number;
  es: number;
  pt: number;
}

export interface NutrientLevels {
  fat: string;
  salt: string;
  "saturated-fat": string;
  sugars: string;
}

export interface Nutriments {
  "added-sugars": number;
  "added-sugars_100g": number;
  "added-sugars_serving": number;
  "added-sugars_unit": Unit;
  "added-sugars_value": number;
  caffeine: number;
  caffeine_100g: number;
  caffeine_serving: number;
  caffeine_unit: string;
  caffeine_value: number;
  carbohydrates: number;
  carbohydrates_100g: number;
  carbohydrates_serving: number;
  carbohydrates_unit: Unit;
  carbohydrates_value: number;
  choline: number;
  choline_100g: number;
  choline_serving: number;
  choline_unit: string;
  choline_value: number;
  copper: number;
  copper_100g: number;
  copper_serving: number;
  copper_unit: string;
  copper_value: number;
  energy: number;
  "energy-kcal": number;
  "energy-kcal_100g": number;
  "energy-kcal_serving": number;
  "energy-kcal_unit": string;
  "energy-kcal_value": number;
  "energy-kcal_value_computed": number;
  "energy-kj": number;
  "energy-kj_100g": number;
  "energy-kj_serving": number;
  "energy-kj_unit": Unit;
  "energy-kj_value": number;
  "energy-kj_value_computed": number;
  energy_100g: number;
  energy_serving: number;
  energy_unit: Unit;
  energy_value: number;
  fat: number;
  fat_100g: number;
  fat_serving: number;
  fat_unit: Unit;
  fat_value: number;
  fiber_modifier: string;
  "fruits-vegetables-legumes-estimate-from-ingredients_100g": number;
  "fruits-vegetables-legumes-estimate-from-ingredients_serving": number;
  "fruits-vegetables-nuts-estimate-from-ingredients_100g": number;
  "fruits-vegetables-nuts-estimate-from-ingredients_serving": number;
  iron: number;
  iron_100g: number;
  iron_serving: number;
  iron_unit: string;
  iron_value: number;
  magnesium: number;
  magnesium_100g: number;
  magnesium_serving: number;
  magnesium_unit: string;
  magnesium_value: number;
  manganese: number;
  manganese_100g: number;
  manganese_serving: number;
  manganese_unit: string;
  manganese_value: number;
  "nova-group": number;
  "nova-group_100g": number;
  "nova-group_serving": number;
  "nutrition-score-fr": number;
  "nutrition-score-fr_100g": number;
  phosphorus: number;
  phosphorus_100g: number;
  phosphorus_serving: number;
  phosphorus_unit: string;
  phosphorus_value: number;
  proteins: number;
  proteins_100g: number;
  proteins_serving: number;
  proteins_unit: Unit;
  proteins_value: number;
  salt: number;
  salt_100g: number;
  salt_serving: number;
  salt_unit: Unit;
  salt_value: number;
  "saturated-fat": number;
  "saturated-fat_100g": number;
  "saturated-fat_serving": number;
  "saturated-fat_unit": Unit;
  "saturated-fat_value": number;
  selenium: number;
  selenium_100g: number;
  selenium_serving: number;
  selenium_unit: string;
  selenium_value: number;
  sodium: number;
  sodium_100g: number;
  sodium_serving: number;
  sodium_unit: Unit;
  sodium_value: number;
  starch: number;
  starch_100g: number;
  starch_serving: number;
  starch_unit: Unit;
  starch_value: number;
  sugars: number;
  sugars_100g: number;
  sugars_serving: number;
  sugars_unit: Unit;
  sugars_value: number;
  "vitamin-a": number;
  "vitamin-a_100g": number;
  "vitamin-a_serving": number;
  "vitamin-a_unit": string;
  "vitamin-a_value": number;
  "vitamin-b1": number;
  "vitamin-b12": number;
  "vitamin-b12_100g": number;
  "vitamin-b12_serving": number;
  "vitamin-b12_unit": string;
  "vitamin-b12_value": number;
  "vitamin-b1_100g": number;
  "vitamin-b1_serving": number;
  "vitamin-b1_unit": string;
  "vitamin-b1_value": number;
  "vitamin-b2": number;
  "vitamin-b2_100g": number;
  "vitamin-b2_serving": number;
  "vitamin-b2_unit": string;
  "vitamin-b2_value": number;
  "vitamin-b6": number;
  "vitamin-b6_100g": number;
  "vitamin-b6_serving": number;
  "vitamin-b6_unit": string;
  "vitamin-b6_value": number;
  "vitamin-b9": number;
  "vitamin-b9_100g": number;
  "vitamin-b9_serving": number;
  "vitamin-b9_unit": string;
  "vitamin-b9_value": number;
  "vitamin-c": number;
  "vitamin-c_100g": number;
  "vitamin-c_serving": number;
  "vitamin-c_unit": string;
  "vitamin-c_value": number;
  "vitamin-e": number;
  "vitamin-e_100g": number;
  "vitamin-e_serving": number;
  "vitamin-e_unit": string;
  "vitamin-e_value": number;
  "vitamin-k": number;
  "vitamin-k_100g": number;
  "vitamin-k_serving": number;
  "vitamin-k_unit": string;
  "vitamin-k_value": number;
  zinc: number;
  zinc_100g: number;
  zinc_serving: number;
  zinc_unit: string;
  zinc_value: number;
}

export enum Unit {
  Empty = "%",
  G = "g",
  KJ = "kJ",
  ML = "ml",
}

export interface Nutriscore {
  category_available: number;
  data: Data;
  grade: EcoscoreGrade;
  nutrients_available: number;
  nutriscore_applicable: number;
  nutriscore_computed: number;
  score: number;
}

export interface Data {
  energy?: number;
  energy_points?: number;
  energy_value?: number;
  fiber?: number;
  fiber_points?: number;
  fiber_value?: number;
  fruits_vegetables_nuts_colza_walnut_olive_oils?: number;
  fruits_vegetables_nuts_colza_walnut_olive_oils_points?: number;
  fruits_vegetables_nuts_colza_walnut_olive_oils_value?: number;
  is_beverage: number;
  is_cheese: string;
  is_fat?: number;
  is_water: number;
  negative_points: number;
  positive_points: number;
  proteins?: number;
  proteins_points?: number;
  proteins_value?: number;
  saturated_fat?: number;
  saturated_fat_points?: number;
  saturated_fat_value?: number;
  sodium?: number;
  sodium_points?: number;
  sodium_value?: number;
  sugars?: number;
  sugars_points?: number;
  sugars_value?: number;
  components?: Components;
  count_proteins?: number;
  count_proteins_reason?: string;
  is_fat_oil_nuts_seeds?: number;
  is_red_meat_product?: number;
  negative_points_max?: number;
  positive_nutrients?: string[];
  positive_points_max?: number;
  grade?: EcoscoreGrade;
  score?: number;
}

export interface Components {
  negative: Tive[];
  positive: Tive[];
}

export interface Tive {
  id: string;
  points: number;
  points_max: number;
  unit: Unit;
  value: number | null;
}

export interface NutriscoreData {
  components: Components;
  count_proteins: number;
  count_proteins_reason: string;
  is_beverage: number;
  is_cheese: string;
  is_fat_oil_nuts_seeds: number;
  is_red_meat_product: number;
  is_water: number;
  negative_points: number;
  negative_points_max: number;
  positive_nutrients: string[];
  positive_points: number;
  positive_points_max: number;
  grade?: EcoscoreGrade;
  score?: number;
}

export interface ProductPackaging {
  food_contact: number;
  material?: string;
  number_of_units: number;
  recycling: string;
  shape: string;
}

export interface PackagingsMaterials {
  all: AllClass;
  "en:plastic": AllClass;
  "en:unknown": AllClass;
}

export interface SelectedImages {
  front: Front;
  ingredients: Front;
  nutrition: Front;
}

export interface Front {
  display: Display;
  small: Display;
  thumb: Display;
}

export interface Display {
  es: string;
  pt: string;
}

export interface Source {
  fields: unknown[];
  id: string;
  images: unknown[];
  import_t: number;
  manufacturer: number;
  name: string;
  url: null;
}
