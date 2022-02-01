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

    if (type === 'deliveryDate') {
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

  return {
    addToCart,
    create,
    formErrors,
    setFormErrors,
    formValues,
    inputChange,
    productOrders,
    removeProductOrder,
    setProductOrders,
  }
}

export default useOrderFormState;
