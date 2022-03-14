/* eslint-disable react/destructuring-assignment */
/* eslint-disable react/jsx-no-target-blank */
/* eslint "react/react-in-jsx-scope": "off" */
/* globals React ReactDOM */
/* eslint "react/jsx-no-undef": "off" */

const cNode = document.getElementById('contents');

function ProductTable(props) {
  // eslint-disable-next-line max-len
  const productRows = props.products.map(product => React.createElement(ProductRow, { key: product.id, product: product }));
  const borderedStyle = { border: '1px solid black', padding: 6 };
  return React.createElement(
    'table',
    { style: { borderCollapse: 'collapse' } },
    React.createElement(
      'thead',
      null,
      React.createElement(
        'tr',
        null,
        React.createElement(
          'th',
          { style: borderedStyle },
          'Name'
        ),
        React.createElement(
          'th',
          { style: borderedStyle },
          'Price'
        ),
        React.createElement(
          'th',
          { style: borderedStyle },
          'Category'
        ),
        React.createElement(
          'th',
          { style: borderedStyle },
          'ImageURL'
        )
      )
    ),
    React.createElement(
      'tbody',
      null,
      productRows
    )
  );
}

class ProductAdd extends React.Component {
  constructor() {
    super();
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit(e) {
    e.preventDefault();
    const form = document.forms.productAdd;
    const product = {
      // eslint-disable-next-line max-len
      name: form.name.value, price: form.price.value ? form.price.value.substring(1) : "", category: form.category.value, imageURL: form.imageURL.value
    };
    // eslint-disable-next-line react/destructuring-assignment
    this.props.createProduct(product);
    form.name.value = '';
    form.price.value = '$';
    form.category.value = '';
    form.imageURL.value = '';
  }

  render() {
    const subHead = {
      fontSize: 22,
      marginBottom: 15,
      borderBottom: '1px solid black',
      padding: 4
    };
    const formFields = {
      width: '40%',
      float: 'left',
      margin: 20
    };
    const pstyle = {
      padding: 0,
      margin: 0,
      fontSize: '14pt'
    };
    const fieldWidth = {
      width: '55%'
    };
    const btnStyle = {
      marginLeft: '20px',
      height: 30,
      marginTop: 10,
      width: 184,
      fontWeight: 70,
      backgroundColor: 'white'
    };
    return React.createElement(
      'form',
      { name: 'productAdd', onSubmit: this.handleSubmit },
      React.createElement(
        'section',
        null,
        React.createElement(
          'div',
          { style: subHead },
          React.createElement(
            'span',
            null,
            'Add a new product to inventory'
          )
        ),
        React.createElement(
          'div',
          null,
          React.createElement(
            'div',
            { style: formFields },
            React.createElement(
              'p',
              { style: pstyle },
              'Category'
            ),
            React.createElement(
              'select',
              { style: fieldWidth, id: 'list', name: 'category' },
              React.createElement(
                'option',
                { value: 'Shirts' },
                'Shirts'
              ),
              React.createElement(
                'option',
                { value: 'Jeans' },
                'Jeans'
              ),
              React.createElement(
                'option',
                { value: 'Jackets' },
                'Jackets'
              ),
              React.createElement(
                'option',
                { value: 'Sweaters' },
                'Sweaters'
              ),
              React.createElement(
                'option',
                { value: 'Accessories' },
                'Accessories'
              )
            )
          ),
          React.createElement(
            'div',
            { style: formFields },
            React.createElement(
              'p',
              { style: pstyle },
              'Price Per Unit'
            ),
            React.createElement('input', { style: fieldWidth, type: 'text', name: 'price', defaultValue: '$' })
          ),
          React.createElement(
            'div',
            { style: formFields },
            React.createElement(
              'p',
              { style: pstyle },
              'Product Name'
            ),
            React.createElement('input', { style: fieldWidth, type: 'text', name: 'name' })
          ),
          React.createElement(
            'div',
            { style: formFields },
            React.createElement(
              'p',
              { style: pstyle },
              'Image URL'
            ),
            React.createElement('input', { style: fieldWidth, type: 'text', name: 'imageURL' })
          )
        )
      ),
      React.createElement(
        'section',
        null,
        React.createElement(
          'button',
          { style: btnStyle },
          'Add Product'
        )
      )
    );
  }
}
function ProductRow(props) {
  const borderedStyle = { border: '1px solid black', padding: 4 };
  const product = props.product;
  let link;
  if (product.imageURL) {
    link = React.createElement(
      'a',
      { href: product.imageURL, target: '_blank' },
      'View'
    );
  } else {
    link = React.createElement(
      'span',
      null,
      'No Image Url added'
    );
  }
  return React.createElement(
    'tr',
    null,
    React.createElement(
      'td',
      { style: borderedStyle },
      product.name
    ),
    React.createElement(
      'td',
      { style: borderedStyle },
      '$',
      product.price
    ),
    React.createElement(
      'td',
      { style: borderedStyle },
      product.category
    ),
    React.createElement(
      'td',
      { style: borderedStyle },
      link
    )
  );
}
class ProductList extends React.Component {
  constructor() {
    super();
    this.state = { products: [] };
    this.createProduct = this.createProduct.bind(this);
  }

  componentDidMount() {
    this.loadData();
  }

  async loadData() {
    const query = `query {
        productlist {
        _id
          id
          name
          price
          category
          imageURL
        }
      }`;
    const response = await fetch(window.ENV.UI_API_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query })
    });

    const body = await response.text();
    const result = JSON.parse(body);
    this.setState({ products: result.data.productlist });
  }

  async createProduct(product) {
    const query = `mutation addprod($product: productInput!) {
            addprod(product: $product) {
                id
            }
          }`;
    /* let productCopy = product;
    productCopy.price = productCopy.price.includes('$') ? productCopy.price.slice(1): productCopy.price; */
    // eslint-disable-next-line no-unused-vars
    const response = await fetch(window.ENV.UI_API_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query, variables: { product } })
    });

    this.loadData();
  }

  render() {
    return React.createElement(
      'div',
      null,
      React.createElement(
        'h1',
        null,
        'My Company Inventory'
      ),
      React.createElement(
        'h2',
        null,
        'Showing all available products '
      ),
      React.createElement('hr', null),
      React.createElement(ProductTable, { products: this.state.products }),
      React.createElement('hr', null),
      React.createElement(ProductAdd, { createProduct: this.createProduct })
    );
  }
}

ReactDOM.render(React.createElement(ProductList, null), cNode);