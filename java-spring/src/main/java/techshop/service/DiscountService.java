package techshop.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import techshop.domain.Discount;
import techshop.repository.DiscountRepository;

@Service
public class DiscountService {

    @Autowired
    private DiscountRepository discountRepository;

    public boolean deleteDiscount(long discountId) {
        Optional<Discount> discount = discountRepository.findById(discountId);

        if (discount.isPresent()) {
            discountRepository.deleteById(discountId);
            return true;
        }

        return false;
    }

    public Discount updateDiscount(Long discountId, Discount discount) {
        Optional<Discount> optionalDiscount = discountRepository.findById(discountId);
        if (optionalDiscount.isEmpty()) {
            return null;
        }
        Discount existingDiscount = optionalDiscount.get();

        // Cập nhật các trường cần thiết
        existingDiscount.setCode(discount.getCode().trim().toUpperCase());
        existingDiscount.setDiscountPercentage(discount.getDiscountPercentage());   
        existingDiscount.setStartDate(discount.getStartDate());
        existingDiscount.setEndDate(discount.getEndDate());

        // Lưu lại discount đã cập nhật
        return discountRepository.save(existingDiscount);
    }

    public Discount createDiscount(Discount discount) {
           // Kiểm tra code đã tồn tại chưa
        if (discountRepository.existsByCode(discount.getCode().trim().toUpperCase())) {
            throw new RuntimeException("Discount code already exists");
        }
        
        // Chuẩn hóa code
        discount.setCode(discount.getCode().trim().toUpperCase());
        
        return discountRepository.save(discount);
    }

    public Discount getDiscountById(Long discountId) {
        Optional<Discount> discount = discountRepository.findById(discountId);
        return discount.orElse(null);
    }

    public List<Discount> getAllDiscounts() {
        return discountRepository.findAll();
    }

}
