package techshop.service;

import java.util.List;
import java.util.Optional;


import org.springframework.stereotype.Service;

import techshop.domain.User;
import techshop.domain.Role;
import techshop.dto.UserDTO;
import techshop.repository.RoleRepository;
import techshop.repository.UserRepository;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;

    public UserService(UserRepository userRepository, RoleRepository roleRepository) {
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
    }
    // tạo hàm sửa user
    public User updateUser(User userUpdate) {
        Optional<User> user = this.userRepository.findById(userUpdate.getUserId());
        if (user.isPresent()) {
            User existingUser = user.get();
            existingUser.setFullName(userUpdate.getFullName());
            existingUser.setEmail(userUpdate.getEmail());
            existingUser.setAvatar(userUpdate.getAvatar());
            existingUser.setPhone(userUpdate.getPhone());
            existingUser.setAvatar(userUpdate.getAvatar());
            // Nếu có thay đổi mật khẩu, mã hóa và cập nhật
            if (userUpdate.getPassword() != null && !userUpdate.getPassword().isEmpty()) {
                String hashPassword = userUpdate.getPassword(); // Giả sử đã mã hóa trước đó
                existingUser.setPassword(hashPassword);
            }
            return this.userRepository.save(existingUser);
        } 
        return null;
    }
    public List<User> getAllStaff() {
        List<User> users = this.userRepository.findAll();
        return users;
    }
    public User getUser(long user_id) {
        Optional<User> user = this.userRepository.findById(user_id);
        if (user.isPresent()) {
            return user.get();
        }
        return null;
        
    }
    public User createUser(UserDTO userDTO) {
        // Kiểm tra xem role có tồn tại không
        Optional<Role> role = this.roleRepository.findByRoleName(userDTO.getRoleName());
        if (!role.isPresent()) {
            throw new RuntimeException("Role not found: " + userDTO.getRoleName());
        }
        User newUser = new User();
        newUser.setFullName(userDTO.getFullName());
        newUser.setEmail(userDTO.getEmail());
        newUser.setPassword(userDTO.getPassword());
        newUser.setPhone(userDTO.getPhone());
        newUser.setAvatar(null); //       
        newUser.setRole(role.get());
        return this.userRepository.save(newUser);
    }
    
    public String deleteUser(long user_id) {
        Optional<User> user = this.userRepository.findById(user_id);
        if (user.isPresent()) {
            this.userRepository.delete(user.get());
            return "Delete user successfully!";
        }
        return "User not found!";
    }
    public User findByEmail(String email) {
        return this.userRepository.findByEmail(email);
    }

    
}
