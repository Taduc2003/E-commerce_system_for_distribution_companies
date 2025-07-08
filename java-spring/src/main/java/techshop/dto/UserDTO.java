package techshop.dto;

import techshop.domain.User;
import techshop.domain.Role;

public class UserDTO {

    private String fullName;
    private String email;
    private String password;
    private String roleName;
    private String phone;

    public String getFullName() {
        return fullName;
    }
    public void setFullName(String fullName) {
        this.fullName = fullName;
    }
    public String getEmail() {
        return email;
    }
    public void setEmail(String email) {
        this.email = email;
    }
 
    public String getPassword() {
        return password;
    } 
    public void setPassword(String password) {
        this.password = password;
    }
    
    public String getRoleName() {
        return roleName;
    }
    public void setRoleName(String roleName) {
        this.roleName = roleName;
    }
    public String getPhone() {
        return phone;
    }
    public void setPhone(String phone) {
        this.phone = phone;
    }

}
