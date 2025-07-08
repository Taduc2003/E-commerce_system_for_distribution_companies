package techshop.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import techshop.domain.Branch;
import techshop.domain.Discount;
import techshop.service.BranchService;
import techshop.service.DiscountService;

@RestController
@RequestMapping("/api/discount")
public class DiscountController {
    private final DiscountService discountService;

    public DiscountController(DiscountService discountService) {
        this.discountService = discountService;
    }

    @GetMapping()
    public ResponseEntity<List<Discount>> getAllDiscounts() {
        return ResponseEntity.ok(discountService.getAllDiscounts());
    }

    @GetMapping("/{discount_id}")
    public ResponseEntity<Discount> getDiscountById(@PathVariable("discount_id") long discountId) {
        Discount discount = this.discountService.getDiscountById(discountId);
        if (discount != null) {
            return ResponseEntity.ok(discount);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping()
    public ResponseEntity<Discount> createDiscount(@RequestBody Discount discount) {
        Discount createdDiscount = this.discountService.createDiscount(discount);
        return ResponseEntity.ok(createdDiscount);
    }

    @PutMapping("/{discount_id}")
    public ResponseEntity<Discount> updateDiscount(@PathVariable("discount_id") long discountId, @RequestBody Discount discount) {
        Discount updatedDiscount = this.discountService.updateDiscount(discountId, discount);
        if (updatedDiscount != null) {
            return ResponseEntity.ok(updatedDiscount);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{discount_id}")
    public ResponseEntity<String> deleteDiscount(@PathVariable("discount_id") long discountId) {
        boolean isDeleted = this.discountService.deleteDiscount(discountId);
        if (isDeleted) {
            return ResponseEntity.noContent().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}
