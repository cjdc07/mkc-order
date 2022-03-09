import * as React from 'react';
import useRequest from './useRequest';

const defaultFormValues = {
  customerName: '',
  customerEmail: '',
  customerContact: '',
  forDelivery: false,
  customerAddress: '',
  deliveryDate: new Date(),
  productOrders: null,
  paymentMethod: 'Cash',
  paymentDueDate: new Date(),
  initialPayment: 0,
};

const optionalFields = ['customerContact', 'customerEmail', 'forDelivery'];

const useOrderFormState = () => {
  const { create } = useRequest();
  const [productOrders, setProductOrders] = React.useState([]);
  const [formValues, setFormValues] = React.useState(defaultFormValues);
  const [formErrors, setFormErrors] = React.useState({});

  const inputChange = (e, type = null) => {
    let id;
    let value;

    if (e.target) {
      id = e.target.id;
      value = e.target.value;
    }

    if (type === 'paymentMethod') {
      id = type;
    }

    if (type === 'deliveryDate' || type === 'paymentDueDate') {
      id = type;
      value = e;
    }

    if (type === 'checkbox') {
      value = e.target.checked;
    }

    if (id === 'forDelivery' && !value) {
      const updatedFormErrors = formErrors;
      delete updatedFormErrors['customerAddress'];
      setFormErrors(updatedFormErrors);
    }

    if (!optionalFields.includes(id)) {
      if (!value || value === '') {
        setFormErrors({
          ...formErrors,
          [id]: 'This field is required.'
        });
      } else if (id === 'initialPayment' && +value > computeTotalProductOrderDue()) {
        setFormErrors({
          ...formErrors,
          initialPayment: 'Initial payment must be less than total.',
        });
      } else {
        const updatedFormErrors = formErrors;
        delete updatedFormErrors[id];
        setFormErrors(updatedFormErrors);
      }
    }

    setFormValues({ ...formValues, [id]: value });
  }

  const addToCart = (productOrder) => {
    const updatedProductOrders = [
      ...productOrders.filter(({id}) => productOrder.id !== id),
      productOrder
    ];

    setProductOrders(updatedProductOrders);
    setFormValues({ ...formValues, productOrders: updatedProductOrders });
  };

  const removeProductOrder = (e, id) => {
    e.stopPropagation();
    const updatedProductOrders = productOrders.filter((productOrder) => productOrder.id !== id);
    setProductOrders(updatedProductOrders);
    setFormValues({ ...formValues, productOrders: updatedProductOrders });
  };

  const clearFields = () => {
    setProductOrders([]);
    setFormValues(defaultFormValues);
  };

  const computeTotalProductOrderDue = () => {
    if (!productOrders) {
      return;
    }

    return productOrders.reduce((acc, { total }) => {
      acc += +total;
      return acc; 
    }, 0);
  };

  return {
    addToCart,
    create,
    formErrors,
    setFormErrors,
    formValues,
    setFormValues,
    inputChange,
    productOrders,
    removeProductOrder,
    setProductOrders,
    clearFields,
    computeTotalProductOrderDue,
  }
}

export default useOrderFormState;
