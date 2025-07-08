package techshop.controller;

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
import org.springframework.web.service.annotation.PutExchange;

import techshop.service.BranchService;
import techshop.domain.Branch;
import techshop.domain.Inventory;
import techshop.dto.BranchDTO;
import java.util.List;

@RestController
@RequestMapping("/api/branch")
public class BranhController {

    private final BranchService branchService;

    public BranhController(BranchService branchService) {
        this.branchService = branchService;
    }

    @GetMapping()
    public ResponseEntity<List<BranchDTO>> getAllBranches() {
        return ResponseEntity.ok(branchService.getAllBranches());
    }

    @GetMapping("/{branch_id}")
    public ResponseEntity<BranchDTO> getBranchById(@PathVariable("branch_id") long branchId) {
        BranchDTO branchDTO = this.branchService.getBranchById(branchId);
        if (branchDTO != null) {
            return ResponseEntity.ok(branchDTO);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping()
    public ResponseEntity<Branch> createBranch(@RequestBody Branch branch) {
        Branch createdBranch = this.branchService.createBranch(branch);
        return ResponseEntity.ok(createdBranch);
    }

    @PutMapping("/{branch_id}")
    public ResponseEntity<Branch> updateBranch(@PathVariable("branch_id") long branchId, @RequestBody Branch branch) {
        Branch updatedBranch = this.branchService.updateBranch(branchId, branch);
        if (updatedBranch != null) {
            return ResponseEntity.ok(updatedBranch);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{branch_id}")
    public ResponseEntity<Void> deleteBranch(@PathVariable("branch_id") long branchId) {
        boolean isDeleted = this.branchService.deleteBranch(branchId);
        if (isDeleted) {
            return ResponseEntity.noContent().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    // Update inventory for a branch
    @PostMapping("/inventory/{branch_id}/update")
    public ResponseEntity<List<Inventory>> updateInventory(@PathVariable("branch_id") long branchId,
            @RequestBody List<Inventory> inventoryUpdates) {
        boolean isUpdated = this.branchService.updateInventory(branchId, inventoryUpdates);
        if (isUpdated) {
            return ResponseEntity.ok(inventoryUpdates);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    // ✅ Thêm endpoint update inventory cho 1 item cụ thể
    @PutMapping("/inventory/{inventoryId}")
    public ResponseEntity<Inventory> updateSingleInventory(@PathVariable("inventoryId") long inventoryId,
            @RequestBody Inventory inventory) {
        Inventory updatedInventory = this.branchService.updateSingleInventory(inventoryId, inventory);
        if (updatedInventory != null) {
            return ResponseEntity.ok(updatedInventory);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

}
