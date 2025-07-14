// src/components/PageLayout.tsx

import React, { useState, useEffect, useCallback } from 'react';
import Sidebar from './Sidebar';
import DynamicForm from './DynamicForm';

// Re-defining interfaces here for self-containment, but ideally from a types.ts file
interface FormField {
  id: string; label: string; type: 'text' | 'number' | 'email' | 'select' | 'checkbox' | 'textarea';
  options?: { value: string; label: string }[]; required?: boolean; defaultValue?: any;
}
interface ApiItem {
  id: string; name: string; formFields: FormField[];
}
interface GetItemsApiResponse {
  success: boolean; message: string; items: ApiItem[];
}
interface SubmitFormApiResponse {
  success: boolean; message: string; submittedData: Record<string, any>;
}

const PageLayout: React.FC = () => {
  const [allItems, setAllItems] = useState<ApiItem[]>([]);
  const [selectedItem, setSelectedItem] = useState<ApiItem | null>(null);
  const [loadingItems, setLoadingItems] = useState<boolean>(false);
  const [itemsError, setItemsError] = useState<string | null>(null);

  // --- Simulate API call to get the list of items with their form definitions ---
  const fetchItems = useCallback(async () => {
    setLoadingItems(true);
    setItemsError(null);
    try {
      // Simulate API response
      const response: GetItemsApiResponse = await new Promise((resolve) => {
        setTimeout(() => {
          resolve({
            success: true,
            message: 'Items fetched successfully',
            items: [
              {
                id: 'userProfile',
                name: 'User Profile Form',
                formFields: [
                  { id: 'fullName', label: 'Full Name', type: 'text', required: true },
                  { id: 'email', label: 'Email', type: 'email', required: true },
                  { id: 'phone', label: 'Phone Number', type: 'text' },
                  { id: 'age', label: 'Age', type: 'number', defaultValue: 30 },
                  { id: 'termsAccepted', label: 'Accept Terms', type: 'checkbox', required: true, defaultValue: false },
                  { id: 'bio', label: 'Bio', type: 'textarea' },
                ],
              },
              {
                id: 'productOrder',
                name: 'Product Order Form',
                formFields: [
                  { id: 'productName', label: 'Product Name', type: 'text', required: true },
                  { id: 'quantity', label: 'Quantity', type: 'number', defaultValue: 1, required: true },
                  {
                    id: 'deliveryMethod',
                    label: 'Delivery Method',
                    type: 'select',
                    options: [
                      { value: '', label: 'Select Delivery' },
                      { value: 'standard', label: 'Standard' },
                      { value: 'express', label: 'Express' },
                    ],
                    required: true,
                  },
                  { id: 'shippingAddress', label: 'Shipping Address', type: 'textarea', required: true },
                ],
              },
              {
                id: 'feedbackSurvey',
                name: 'Feedback Survey',
                formFields: [
                  { id: 'rating', label: 'Overall Rating (1-5)', type: 'number', defaultValue: 5 },
                  { id: 'comments', label: 'Your Feedback', type: 'textarea' },
                  { id: 'contactPermission', label: 'Allow Contact', type: 'checkbox', defaultValue: true },
                ],
              },
              {
                id: 'newProject',
                name: 'New Project Request',
                formFields: [
                  { id: 'projectName', label: 'Project Name', type: 'text', required: true },
                  { id: 'projectLead', label: 'Project Lead Email', type: 'email', required: true },
                  { id: 'budget', label: 'Budget (USD)', type: 'number' },
                  { id: 'startDate', label: 'Proposed Start Date', type: 'text' }, // Could be type 'date' in real app
                ],
              },
            ],
          });
        }, 1500); // Simulate network delay
      });

      if (response.success) {
        setAllItems(response.items);
      } else {
        setItemsError(response.message);
      }
    } catch (error: any) {
      setItemsError(`Failed to load items: ${error.message || 'An unknown error occurred.'}`);
    } finally {
      setLoadingItems(false);
    }
  }, []);

  // Fetch items when the component mounts
  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  // --- Simulate API call for form submission ---
  const handleFormSubmission = useCallback(async (data: Record<string, any>): Promise<SubmitFormApiResponse> => {
    // In a real app, this would be an actual API call to your backend
    console.log(`Submitting form for item: ${selectedItem?.name}`, data);
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          message: `Form for "${selectedItem?.name}" submitted successfully!`,
          submittedData: data,
        });
      }, 1000); // Simulate submission delay
    });
  }, [selectedItem]); // Dependency on selectedItem ensures correct message

  const handleItemSelected = (item: ApiItem) => {
    setSelectedItem(item);
  };

  return (
    <div className="page-layout">
      <Sidebar
        items={allItems}
        onItemSelected={handleItemSelected}
        selectedItemId={selectedItem?.id || null}
      />
      <div className="main-content">
        {loadingItems && <p className="loading-text">Loading available forms...</p>}
        {itemsError && <p className="error-message">Error: {itemsError}</p>}

        {!loadingItems && !itemsError && allItems.length === 0 && (
          <p className="loading-text">No forms available. Please check the API.</p>
        )}

        {selectedItem ? (
          <>
            <h2>Form for: {selectedItem.name}</h2>
            <DynamicForm
              formFields={selectedItem.formFields}
              onFormSubmit={handleFormSubmission}
            />
          </>
        ) : (
          !loadingItems && !itemsError && allItems.length > 0 && (
            <h2 style={{ textAlign: 'center', marginTop: '50px', color: '#666' }}>
              Select an item from the sidebar to open its form.
            </h2>
          )
        )}
      </div>
    </div>
  );
};

export default PageLayout;