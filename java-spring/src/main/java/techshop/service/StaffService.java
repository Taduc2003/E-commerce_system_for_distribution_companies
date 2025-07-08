package techshop.service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import techshop.domain.User;
import techshop.domain.Branch;
import techshop.domain.BranchDetail;
import techshop.dto.StaffDTO;
import techshop.repository.UserRepository;
import techshop.repository.BranchRepository;
import techshop.repository.BranchDetailRepository;
import techshop.mapper.StaffMapper;

@Service
public class StaffService {

    private final UserRepository userRepository;
    private final BranchDetailRepository branchDetailRepository;
    private final BranchRepository branchRepository;
    private final StaffMapper staffMapper;

    public StaffService(UserRepository userRepository, BranchRepository branchRepository ,StaffMapper staffMapper, BranchDetailRepository branchDetailRepository) {
        this.branchDetailRepository = branchDetailRepository;
        this.branchRepository = branchRepository;
        this.staffMapper = staffMapper;
        this.userRepository = userRepository;
    }

    public List<StaffDTO> getAllStaff() {
        List<User> users = userRepository.findAll();
        return users.stream()
                .filter(user -> user.getRole() != null && 
                       (user.getRole().getRoleName().equals("STAFF") || 
                        user.getRole().getRoleName().equals("SHIPPER")))
                .map(user -> {
                    Branch branch= getBranchByUserId(user.getUserId());
                    return staffMapper.convertToDTO(user, branch);
                })
                .collect(Collectors.toList());
    }

    public StaffDTO getStaffById(long staffId) {
        Optional<User> userOptional = userRepository.findById(staffId);
        if (userOptional.isPresent()) {
            User user = userOptional.get();
            if (user.getRole() != null && 
                (user.getRole().getRoleName().equals("STAFF") || 
                 user.getRole().getRoleName().equals("SHIPPER"))) {
                Branch branch = getBranchByUserId(staffId);
                return staffMapper.convertToDTO(user, branch);
            }
        }
        return null;
    }

    public StaffDTO updateStaff(long staffId, StaffDTO staffDTO) {
        Optional<User> userOptional = userRepository.findById(staffId);
        if (userOptional.isPresent()) {
            User user = userOptional.get();
            
            // Update user fields
            user.setFullName(staffDTO.getFullName());
            user.setEmail(staffDTO.getEmail());
            user.setPhone(staffDTO.getPhone());
            if (staffDTO.getPassword() != null && !staffDTO.getPassword().isEmpty()) {
                user.setPassword(staffDTO.getPassword());
            }
            user.setRole(staffDTO.getRole());
            
            User updatedUser = userRepository.save(user);
           
            return staffMapper.convertToDTO(updatedUser, staffDTO.getBranch());
        }
        return null;
    }

    public StaffDTO createStaff(StaffDTO staffDTO) {
        User user = new User();
        user.setFullName(staffDTO.getFullName());
        user.setEmail(staffDTO.getEmail());
        user.setPhone(staffDTO.getPhone());
        user.setPassword(staffDTO.getPassword());
        user.setRole(staffDTO.getRole());
        user.setAvatar(staffDTO.getAvatar());
        
        // Save the user first
        User savedUser = userRepository.save(user);
        
        // Create and save branch detail if branchId is provided in staffDTO
        if (staffDTO.getBranch() != null) {
            BranchDetail branchDetail = new BranchDetail();
            branchDetail.setUser(savedUser);
            branchDetail.setBranch(staffDTO.getBranch());
            branchDetailRepository.save(branchDetail);
        }
        
        return staffMapper.convertToDTO(savedUser, staffDTO.getBranch());
    }

    public boolean deleteStaff(long staffId) {
        Optional<User> userOptional = userRepository.findById(staffId);
        Optional<BranchDetail> branchDetailOptional = branchDetailRepository.findByUser_UserId(staffId);
        if (userOptional.isPresent() && branchDetailOptional.isPresent()) {
            User user = userOptional.get();
            BranchDetail branchDetail = branchDetailOptional.get();
            if (user.getRole() != null && 
                (user.getRole().getRoleName().equals("STAFF") || 
                 user.getRole().getRoleName().equals("SHIPPER"))) {
                userRepository.deleteById(staffId);
                branchDetailRepository.delete(branchDetail);
                return true;
            }
        }
        return false;
    }
    
    private Branch getBranchByUserId(Long userId) {
        Optional<BranchDetail> branchDetailOptional = branchDetailRepository.findByUser_UserId(userId);
        if (branchDetailOptional.isPresent()) {
            return branchDetailOptional.get().getBranch();
        }
        return null;
    }
}