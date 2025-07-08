package techshop.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import techshop.domain.Product;
import techshop.dto.ProductDTO;
import techshop.repository.CategoryRepository;
import techshop.repository.ProductRepository;
import techshop.domain.Category;

@Service
public class ProductService {

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private CategoryRepository categoryRepository;


    public Product getProductById(long product_id) {
        Optional<Product> product = productRepository.findById(product_id);
        if (product.isPresent()) {
            return product.get();
        }
        return null; 
    }

    public Product createProduct(ProductDTO productDto) {
        Category category = categoryRepository.findByCategoryName(productDto.getCategoryName());

        Product product = new Product();
        product.setProductName(productDto.getProductName());
        product.setPrice(productDto.getPrice());
        product.setImage(productDto.getImage());
        product.setDescription(productDto.getDescription());
        product.setCategory(category);

        product.setSupplier(productDto.getSupplier());

        return productRepository.save(product);
    }

    public Product updateProduct(long product_id, ProductDTO productDto) {
        Optional<Product> existingProduct = this.productRepository.findById(product_id);
        Category category = categoryRepository.findByCategoryName(productDto.getCategoryName());
        if (existingProduct.isPresent()) {
            Product updatedProduct = existingProduct.get();
            updatedProduct.setProductName(productDto.getProductName());
            updatedProduct.setPrice(productDto.getPrice());
            updatedProduct.setImage(productDto.getImage());
            updatedProduct.setDescription(productDto.getDescription());
            updatedProduct.setCategory(category);
            updatedProduct.setSupplier(productDto.getSupplier());
            return this.productRepository.save(updatedProduct);
        } 
        return null;
    }

    public String deleteProduct(long product_id) {
        Optional<Product> product = this.productRepository.findById(product_id);
        if (product.isPresent()) {
            this.productRepository.delete(product.get());
            return "Delete product successfully!";
        }
        return "Product not found!";
    }

    public List<Product> getAllProducts() {
        List<Product> products = this.productRepository.findAll();
        return products;
    }
    
}
