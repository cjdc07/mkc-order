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

const optionalFields = ['contact', 'email'];

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

    if (!optionalFields.includes(id)) {
      if (!value || value === '') {
        setFormErrors({
          ...formErrors,
          [id]: 'This field is required.'
        });
      } else {
        setFormErrors({...formErrors, [id]: null});
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
    formValues,
    inputChange,
    productOrders,
    removeProductOrder,
    setProductOrders,
  }
}

export default useOrderFormState;
