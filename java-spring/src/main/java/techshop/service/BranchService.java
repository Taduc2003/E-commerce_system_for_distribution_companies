package techshop.service;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import techshop.domain.Branch;
import techshop.domain.BranchDetail;
import techshop.domain.Inventory;
import techshop.domain.Product;
import techshop.dto.BranchDTO;
import techshop.repository.BranchRepository;
import techshop.repository.InventoryRepository;
import techshop.repository.ProductRepository;
import techshop.repository.BranchDetailRepository;

@Service
public class BranchService {

    @Autowired
    private BranchRepository branchRepository;

    @Autowired
    private BranchDetailRepository branchDetailRepository;

    @Autowired
    private InventoryRepository inventoryRepository;

    @Autowired
    private ProductRepository productRepository;

    public List<BranchDTO> getAllBranches() {
        List<Branch> branches = branchRepository.findAll();

        return branches.stream().map(branch -> {
            BranchDTO branchDTO = new BranchDTO();
            branchDTO.setBranchId(branch.getBranchId());
            branchDTO.setAddress(branch.getAddress());
            branchDTO.setPhone(branch.getPhone());
            branchDTO.setInventories(inventoryRepository.findByBranch_BranchId(branch.getBranchId()));
            return branchDTO;
        }).toList(); // Convert to List<BranchDTO>
    }

    public BranchDTO getBranchById(long branchId) {
        Branch branch = branchRepository.findById(branchId).orElse(null);
        if (branch == null) {
            return null; // Return null if branch not found
        }

        BranchDTO branchDTO = new BranchDTO();
        branchDTO.setBranchId(branch.getBranchId());
        branchDTO.setAddress(branch.getAddress());
        branchDTO.setPhone(branch.getPhone());
        branchDTO.setInventories(inventoryRepository.findByBranch_BranchId(branch.getBranchId()));

        return branchDTO; // Return the DTO representation of the branch

    }

    public Branch createBranch(Branch branch) {
        // Kiểm tra xem địa chỉ đã tồn tại chưa
        if (branchRepository.findByAddress(branch.getAddress()) != null) {
            throw new RuntimeException("Branch with this address already exists");
        }

        Branch newBranch = branchRepository.save(branch);

        // Tạo inventory cho branch mới với tất cả sản phẩm có quantiry = 0
        List<Product> products = productRepository.findAll();
        for (Product product : products) {
            Inventory inventory = new Inventory();
            inventory.setBranch(newBranch);
            inventory.setProduct(product);
            inventory.setLastUpdated(LocalDateTime.now()); // Cập nhật thời gian hiện tại
            inventory.setQuantity(0); // Khởi tạo số lượng là 0
            inventoryRepository.save(inventory); // Lưu inventory mới
        }
        // Lưu branch mới
        return newBranch;
    }

    public Branch updateBranch(long branchId, Branch branch) {
        Branch existingBranch = branchRepository.findById(branchId).orElse(null);
        if (existingBranch == null) {
            return null; // Return null if branch not found
        }

        // Cập nhật các trường cần thiết
        if (branchRepository.findByAddress(branch.getAddress()) != null) {
            throw new RuntimeException("Branch with this address already exists");
        }

        existingBranch.setAddress(branch.getAddress());
        existingBranch.setPhone(branch.getPhone());

        // Lưu lại branch đã cập nhật
        return branchRepository.save(existingBranch);
    }

    public boolean deleteBranch(long branchId) {

        if (branchRepository.findById(branchId) != null) {
            // Xóa tất cả inventory liên quan đến branch này
            List<Inventory> inventories = inventoryRepository.findByBranch_BranchId(branchId);
            for (Inventory inventory : inventories) {
                inventoryRepository.delete(inventory); // Xóa từng inventory
            }
            // Xóa employees or other related entities
            List<BranchDetail> branchDetails = branchDetailRepository.findByBranch_BranchId(branchId);
            for (BranchDetail branchDetail : branchDetails) {
                branchDetailRepository.delete(branchDetail); // Xóa từng branch detail
            }

            // Xóa branch
            branchRepository.deleteById(branchId);
            
            return true; // Return true if deletion was successful
        }
        return false; // Return false if branch not found
    }

    public boolean updateInventory(long branchId, List<Inventory> inventoryUpdates) {
        Branch branch = branchRepository.findById(branchId).orElse(null);
        if (branch == null) {
            return false; // Return false if branch not found
        }

        // Cập nhật kho hàng cho chi nhánh
        for (Inventory update : inventoryUpdates) {
            Inventory existingInventory = inventoryRepository.findByInventoryId(update.getInventoryId());
            if (existingInventory != null) {
                // Cập nhật số lượng và thời gian cập nhật
                existingInventory.setQuantity(update.getQuantity());
                existingInventory.setLastUpdated(LocalDateTime.now());
                inventoryRepository.save(existingInventory); // Lưu lại thay đổi
            } else {
                // Nếu không tìm thấy inventory, có thể tạo mới hoặc báo lỗi
                return false; // Return false if inventory not found for the product
            }
        }

        return true; // Return true if inventory updates were successful
    }

    // ✅ Thêm method update inventory cho 1 item
    public Inventory updateSingleInventory(long inventoryId, Inventory inventoryUpdate) {
        Inventory existingInventory = inventoryRepository.findById(inventoryId).orElse(null);
        if (existingInventory == null) {
            return null;
        }

        // Cập nhật số lượng và thời gian
        existingInventory.setQuantity(inventoryUpdate.getQuantity());
        existingInventory.setLastUpdated(LocalDateTime.now());

        return inventoryRepository.save(existingInventory);
    }

}
