"""Security analysis service"""
from typing import Dict, Any, List
from app.db.models import SeverityLevel, ConfigType


class SecurityRule:
    """Base class for security rules"""
    
    def __init__(self, severity: SeverityLevel, category: str):
        self.severity = severity
        self.category = category
    
    def analyze(self, config: Dict[str, Any]) -> List[Dict[str, Any]]:
        """Analyze configuration and return findings"""
        raise NotImplementedError


class TwoFactorAuthRule(SecurityRule):
    """Check for 2FA enforcement"""
    
    def __init__(self):
        super().__init__(SeverityLevel.HIGH, "Authentication")
    
    def analyze(self, config: Dict[str, Any]) -> List[Dict[str, Any]]:
        findings = []
        
        # Check if config contains user data
        if "user" in config or "users" in config:
            users_data = config.get("users", [config.get("user")])
            
            for user in users_data:
                if isinstance(user, dict):
                    if not user.get("isEnforcedIn2Sv", False):
                        findings.append({
                            "title": "Two-Factor Authentication Not Enforced",
                            "description": f"User {user.get('primaryEmail', 'unknown')} does not have 2FA enforced",
                            "recommendation": "Enable 2FA enforcement for all users to improve account security",
                            "affected_settings": {"user": user.get("primaryEmail")},
                            "remediation_steps": [
                                "Go to Admin Console > Security > 2-Step Verification",
                                "Select 'Enforce 2-Step Verification'",
                                "Set appropriate enforcement date"
                            ]
                        })
        
        return findings


class PasswordPolicyRule(SecurityRule):
    """Check password policy settings"""
    
    def __init__(self):
        super().__init__(SeverityLevel.MEDIUM, "Authentication")
    
    def analyze(self, config: Dict[str, Any]) -> List[Dict[str, Any]]:
        findings = []
        
        # Check password length
        min_length = config.get("passwordLengthMin", 8)
        if min_length < 12:
            findings.append({
                "title": "Weak Password Length Requirement",
                "description": f"Minimum password length is set to {min_length} characters",
                "recommendation": "Set minimum password length to at least 12 characters",
                "affected_settings": {"passwordLengthMin": min_length},
                "remediation_steps": [
                    "Go to Admin Console > Security > Password management",
                    "Set minimum password length to 12 or more characters"
                ]
            })
        
        # Check password expiration
        if config.get("passwordExpiration", 0) == 0:
            findings.append({
                "title": "No Password Expiration Policy",
                "description": "Passwords are set to never expire",
                "recommendation": "Consider implementing password expiration (e.g., 90 days) or use strong alternative controls",
                "affected_settings": {"passwordExpiration": 0},
                "remediation_steps": [
                    "Go to Admin Console > Security > Password management",
                    "Set password expiration policy (recommended: 90 days)",
                    "Alternatively, ensure strong 2FA enforcement is in place"
                ]
            })
        
        return findings


class ExternalSharingRule(SecurityRule):
    """Check external sharing settings"""
    
    def __init__(self):
        super().__init__(SeverityLevel.HIGH, "Data Protection")
    
    def analyze(self, config: Dict[str, Any]) -> List[Dict[str, Any]]:
        findings = []
        
        # Check Drive sharing settings
        if "drive" in config:
            drive_config = config["drive"]
            
            if drive_config.get("externalSharingEnabled", True):
                findings.append({
                    "title": "External Sharing Enabled",
                    "description": "Drive allows sharing files with external users",
                    "recommendation": "Review and restrict external sharing permissions if not required",
                    "affected_settings": {"externalSharingEnabled": True},
                    "remediation_steps": [
                        "Go to Admin Console > Apps > Google Workspace > Drive and Docs",
                        "Review sharing settings",
                        "Restrict external sharing if not needed for business operations"
                    ]
                })
        
        return findings


class AdminRoleRule(SecurityRule):
    """Check for excessive admin privileges"""
    
    def __init__(self):
        super().__init__(SeverityLevel.CRITICAL, "Access Control")
    
    def analyze(self, config: Dict[str, Any]) -> List[Dict[str, Any]]:
        findings = []
        
        # Check for super admin assignments
        if "users" in config:
            super_admins = [
                user for user in config["users"]
                if isinstance(user, dict) and user.get("isAdmin", False)
            ]
            
            if len(super_admins) > 3:
                findings.append({
                    "title": "Excessive Super Admin Assignments",
                    "description": f"Found {len(super_admins)} super admin accounts",
                    "recommendation": "Limit super admin access to minimum necessary personnel",
                    "affected_settings": {"superAdminCount": len(super_admins)},
                    "remediation_steps": [
                        "Review all super admin accounts",
                        "Remove unnecessary super admin privileges",
                        "Use delegated admin roles where possible"
                    ]
                })
        
        return findings


class SecurityService:
    """Service for analyzing security configurations"""
    
    def __init__(self):
        self.rules = [
            TwoFactorAuthRule(),
            PasswordPolicyRule(),
            ExternalSharingRule(),
            AdminRoleRule(),
        ]
    
    def analyze_configuration(
        self,
        config_data: Dict[str, Any],
        config_type: ConfigType
    ) -> List[Dict[str, Any]]:
        """Analyze configuration and return security findings"""
        all_findings = []
        
        for rule in self.rules:
            try:
                findings = rule.analyze(config_data)
                for finding in findings:
                    finding["severity"] = rule.severity
                    finding["category"] = rule.category
                all_findings.extend(findings)
            except Exception as e:
                # Log error but continue with other rules
                print(f"Error in rule {rule.__class__.__name__}: {str(e)}")
        
        return all_findings
    
    def get_security_score(self, findings: List[Dict[str, Any]]) -> int:
        """Calculate a security score (0-100) based on findings"""
        if not findings:
            return 100
        
        # Deduct points based on severity
        deductions = {
            SeverityLevel.CRITICAL: 25,
            SeverityLevel.HIGH: 15,
            SeverityLevel.MEDIUM: 10,
            SeverityLevel.LOW: 5,
            SeverityLevel.INFO: 2,
        }
        
        total_deduction = sum(
            deductions.get(finding.get("severity", SeverityLevel.INFO), 0)
            for finding in findings
        )
        
        score = max(0, 100 - total_deduction)
        return score

