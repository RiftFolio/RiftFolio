function Card({ name, image, price, set, domain }) {
    return (
        <div>
            <img src={image} alt={`${name} `} />
        </div>
    );
}

export default Card;