package techshop.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import techshop.domain.Branch;
import techshop.dto.BranchDTO;
import techshop.repository.BranchRepository;
import techshop.repository.InventoryRepository;

@Service
public class BranchService {

    @Autowired
    private BranchRepository branchRepository;

    @Autowired
    private InventoryRepository inventoryRepository;

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

    public Branch getBranchById(long branchId) {
        return branchRepository.findById(branchId)
                .orElse(null); // Return null if branch not found
    }

    public Branch createBranch(Branch branch) {
        // Kiểm tra xem địa chỉ đã tồn tại chưa
        if (branchRepository.findByAddress(branch.getAddress()) != null) {
            throw new RuntimeException("Branch with this address already exists");
        }

        // Lưu branch mới
        return branchRepository.save(branch);
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
            branchRepository.deleteById(branchId);
            return true; // Return true if deletion was successful
        }
        return false; // Return false if branch not found
    }

    
}
