// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract NDDCTransparency {
    struct Project {
        string name;
        uint256 allocatedFunds;
        uint256 releasedFunds;
        address contractor;
        bool approved;
    }

    mapping(uint256 => Project) public projects;
    uint256 public projectCount;

    event ProjectCreated(uint256 projectId, string name, uint256 funds, address contractor);
    event FundsReleased(uint256 projectId, uint256 amount);
    event ProjectApproved(uint256 projectId);

    constructor() {
        projectCount = 0; // Ensure counter starts from 0
    }

    function createProject(string memory _name, uint256 _funds, address _contractor) public {
        uint256 projectId = projectCount;
        projects[projectId] = Project(_name, _funds, 0, _contractor, false);
        
        emit ProjectCreated(projectId, _name, _funds, _contractor);
        
        projectCount++;
    }

    function approveProject(uint256 _projectId) public {
        require(_projectId < projectCount, "Invalid project ID");
        projects[_projectId].approved = true;
        emit ProjectApproved(_projectId);
    }

    function releaseFunds(uint256 _projectId, uint256 _amount) public {
        require(_projectId < projectCount, "Invalid project ID");
        require(projects[_projectId].approved, "Project not approved yet");
        require(projects[_projectId].allocatedFunds >= projects[_projectId].releasedFunds + _amount, "Insufficient funds");

        projects[_projectId].releasedFunds += _amount;
        payable(projects[_projectId].contractor).transfer(_amount);
        
        emit FundsReleased(_projectId, _amount);
    }

    function getProjectDetails(uint256 _projectId) public view returns (string memory, uint256, uint256, address, bool) {
        require(_projectId < projectCount, "Invalid project ID");
        Project memory proj = projects[_projectId];
        return (proj.name, proj.allocatedFunds, proj.releasedFunds, proj.contractor, proj.approved);
    }

    function getProjectCount() public view returns (uint256) {
        return projectCount;
    }

    receive() external payable {}
}
