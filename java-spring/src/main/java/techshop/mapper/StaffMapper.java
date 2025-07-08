package techshop.mapper;

import org.springframework.stereotype.Component;

import techshop.domain.Branch;
import techshop.domain.User;
import techshop.dto.StaffDTO;

@Component
public class StaffMapper {
    public StaffDTO convertToDTO(User user, Branch branch) {
        StaffDTO staffDTO = new StaffDTO();
        staffDTO.setFullName(user.getFullName());
        staffDTO.setEmail(user.getEmail());
        staffDTO.setPhone(user.getPhone());
        staffDTO.setRole(user.getRole());
        staffDTO.setAvatar(user.getAvatar());
        staffDTO.setBranch(branch);
        return staffDTO;
    }
}
