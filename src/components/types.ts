// Define the structure of an item returned by the API
// Each item will represent a type of form we can open
interface ApiItem {
  id: string;        // Unique identifier for the item
  name: string;      // Display name for the item in the sidebar
  formFields: FormField[]; // Array of form field definitions for this item
}

// Define the structure of a single form field
interface FormField {
  id: string;
  label: string;
  type: 'text' | 'number' | 'email' | 'select' | 'checkbox' | 'textarea';
  options?: { value: string; label: string }[];
  required?: boolean;
  defaultValue?: any;
}

// Define the structure of the API response for the list of items
interface GetItemsApiResponse {
  success: boolean;
  message: string;
  items: ApiItem[];
}

// Define the structure of the API response after form submission
interface SubmitFormApiResponse {
  success: boolean;
  message: string;
  submittedData: Record<string, any>;
}