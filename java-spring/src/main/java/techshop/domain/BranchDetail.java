package techshop.domain;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;

@Entity(name = "BranchDetail")
public class BranchDetail {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long branchDetailId;

    @ManyToOne
    @JoinColumn(name = "branch_id", nullable = false)
    private Branch branch;

    
    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    public Long getBranchDetailId() {
        return branchDetailId;
    }

    public void setBranchDetailId(Long branchDetailId) {
        this.branchDetailId = branchDetailId;
    }

    public Branch getBranch() {
        return branch;
    }

    public void setBranch(Branch branch) {
        this.branch = branch;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }


}
