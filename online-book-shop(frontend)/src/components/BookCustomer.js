
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';

export default function BookCustomer(props) {
    const { book, index, addToCart } = props;

    return (
        <Card style={{ width: '21rem' }}>
            <Card.Img style={{ width: '21rem', height: '15rem' }} variant="top" src={require(`../images/${book.BookTitle}.jpeg`)} />
            <Card.Body>
                <Card.Title>{index + 1}. {book.BookTitle} <b className='text-success mx-3'>${book.Price}</b></Card.Title>
                <Card.Text>
                    <ul>
                        <li><b>Publisher</b>: <em>{book.Publisher}</em></li>
                        <li><b>Date Published</b>: <em>{book.DatePublished}</em></li>
                        <li><b>ISBN</b>: {book.ISBN}</li>
                    </ul>
                </Card.Text>
                <div className='row'>
                    <Button onClick={() => addToCart(book)} variant="secondary">Add To Cart</Button>
                </div>
            </Card.Body>
        </Card>
    );
}
