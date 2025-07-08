package techshop.controller;

import org.springframework.web.bind.annotation.RestController;

import techshop.domain.User;
import techshop.dto.StaffDTO;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;

import techshop.service.StaffService;
import techshop.service.UploadFileService;

@RestController
@RequestMapping("api/staff")
public class StaffController {

    private final StaffService StaffService;

    public StaffController(StaffService StaffService) {
        this.StaffService = StaffService;
    }

    @GetMapping("")
    public ResponseEntity<List<StaffDTO>> getAllStaff() {
        List<StaffDTO> staffs = this.StaffService.getAllStaff();
        return ResponseEntity.ok(staffs);
    }

    @GetMapping("/{staff_id}")
    public ResponseEntity<StaffDTO> getStaffById(@PathVariable("staff_id") long staffId) {
        StaffDTO staff = this.StaffService.getStaffById(staffId);
        if (staff != null) {
            return ResponseEntity.ok(staff);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @PutMapping("/{staff_id}")
    public ResponseEntity<StaffDTO> updateStaff(@PathVariable("staff_id") long staffId, @RequestBody StaffDTO staff) {
        StaffDTO updatedStaff = this.StaffService.updateStaff(staffId, staff);
        if (updatedStaff != null) {
            return ResponseEntity.ok(updatedStaff);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping()
    public ResponseEntity<StaffDTO> createStaff(@RequestBody StaffDTO staff) {
        // Create random password
        staff.setPassword(java.util.UUID.randomUUID().toString().substring(0, 12));
        StaffDTO createdStaff = this.StaffService.createStaff(staff);
        return ResponseEntity.ok(createdStaff);
    }

    @DeleteMapping("/{staff_id}")
    public ResponseEntity<Void> deleteStaff(@PathVariable("staff_id") long staffId) {
        boolean isDeleted = this.StaffService.deleteStaff(staffId);
        if (isDeleted) {
            return ResponseEntity.noContent().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}
