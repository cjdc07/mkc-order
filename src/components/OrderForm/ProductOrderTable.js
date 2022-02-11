import * as React from 'react';
import RemoveIcon from '@mui/icons-material/RemoveCircleOutline';
import { IconButton, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';

import {formatToCurrency} from '../../utils'

const ProductOrderTable = ({ productOrders, editProductOrder, removeProductOrder}) => {

  const totalProductOrderPrice = () => {
    if (!productOrders) {
      return;
    }

    return productOrders.reduce((acc, { total }) => {
      acc += +total;
      return acc; 
    }, 0);
  };

  return <>
    <TableContainer sx={{height: '100%'}}>
      <Table stickyHeader size="small" sx={{ width: '100%', paddingTop: 2}}>
        <TableHead>
          <TableRow>
            {removeProductOrder && <TableCell></TableCell>}
            <TableCell>Code</TableCell>
            <TableCell>Name</TableCell>
            <TableCell>Price</TableCell>
            <TableCell>Qty</TableCell>
            <TableCell>Total</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {productOrders && productOrders.length > 0 ?
            <>
              {productOrders.map((productOrder) => (
                <TableRow
                  key={productOrder.id}
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                  onClick={() => editProductOrder && editProductOrder(productOrder)}
                >
                  {removeProductOrder &&
                    <TableCell>
                      <IconButton
                        color="error"
                        onClick={(e) => removeProductOrder && removeProductOrder(e, productOrder.id)}
                        aria-label="close"
                      >
                        <RemoveIcon />
                      </IconButton>
                    </TableCell>
                  }
                  <TableCell>{productOrder.code}</TableCell>
                  <TableCell>{productOrder.name}</TableCell>
                  <TableCell>{formatToCurrency(productOrder.price)}</TableCell>
                  <TableCell>{productOrder.quantity}</TableCell>
                  <TableCell align="right">{formatToCurrency(productOrder.total)}</TableCell>
                </TableRow>
              ))}
            </>:
            <TableRow>
              <TableCell colSpan={6} align="center">
                <p>No products added yet</p>
              </TableCell>
            </TableRow>
          }
        </TableBody>
      </Table>
    </TableContainer>
    <TableContainer>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell colSpan={6}></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          <TableRow>
            <TableCell rowSpan={2} colSpan={3}/>
          </TableRow>
          <TableRow sx={{height: 56 }}>
            <TableCell colSpan={2}>Total</TableCell>
            <TableCell align="right">
              {formatToCurrency(totalProductOrderPrice())}
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
  </>
}

export default ProductOrderTable;
