package techshop.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import jakarta.validation.Valid;
import techshop.domain.User;
import techshop.dto.UserDTO;
import techshop.service.UploadFileService;
import techshop.service.UserService;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.RequestBody;

@RestController
@RequestMapping("/api/user")
public class UserController {

    private final UserService userService;
    private final UploadFileService uploadFileService;
    private PasswordEncoder passwordEncoder;

    public UserController(UserService userService, UploadFileService uploadFileService,
            PasswordEncoder passwordEncoder) {
        this.uploadFileService = uploadFileService;
        this.userService = userService;
        this.passwordEncoder = passwordEncoder;
    }

    @GetMapping("/{user_id}")
    public ResponseEntity<User> getUser(@PathVariable("user_id") long userId) {
        User user = this.userService.getUser(userId);
        if (user != null) {
            return ResponseEntity.ok(user);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping("/sign-up")
    public ResponseEntity<User> signUp(@RequestBody UserDTO userDTO) {
        // Handle file upload
        // String filePath = this.uploadFileService.handleSaveUploadFile(uploadedFile,
        // "avatar");
        // user.setAvatar(filePath);
        
        String hashPassword = this.passwordEncoder.encode(userDTO.getPassword());
        userDTO.setPassword(hashPassword);

        User createdUser = this.userService.createUser(userDTO);
        return ResponseEntity.ok(createdUser);
    }

    @DeleteMapping("/{user_id}")
    public ResponseEntity<String> deleteUser(@PathVariable("user_id") long userId) {
        return ResponseEntity.ok(this.userService.deleteUser(userId));
    }

    @PutMapping("/{user_id}")
    public ResponseEntity<User> updateUser(@RequestBody User userUpdate) {
        if(userUpdate.getPassword() != null && !userUpdate.getPassword().isEmpty()) {
            // Encode the password before saving
            String hashPassword = this.passwordEncoder.encode(userUpdate.getPassword());
            userUpdate.setPassword(hashPassword);
        }
        return ResponseEntity.ok(this.userService.updateUser(userUpdate));
    }

    @PostMapping("/upload-avatar")
    public ResponseEntity<String> uploadAvatar(@RequestParam("file") MultipartFile file) {
        if (file.isEmpty()) {
            return ResponseEntity.badRequest().body("No file uploaded");
        }
        String filePath = this.uploadFileService.handleSaveUploadFile(file, "avatar");
        return ResponseEntity.ok(filePath);
    }
}
