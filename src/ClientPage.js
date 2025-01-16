import React from 'react';

function ClientPage() {
    const products = [
        { id: 1, name: 'Produit 1', price: 20 },
        { id: 2, name: 'Produit 2', price: 30 },
        { id: 3, name: 'Produit 3', price: 50 },
      ];
    
      return (
        <div>
          <h1>Nos Produits</h1>
          <div>
            {products.map((product) => (
              <div key={product.id}>
                <h3>{product.name}</h3>
                <p>€{product.price}</p>
                <button>Ajouter au panier</button>
              </div>
            ))}
          </div>
        </div>
      );
    }


export default ClientPage;
