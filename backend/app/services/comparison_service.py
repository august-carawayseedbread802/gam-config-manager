"""Configuration comparison service"""
from typing import Dict, Any, List, Tuple
import json


class ComparisonService:
    """Service for comparing configurations"""
    
    @staticmethod
    def compare_configs(
        source: Dict[str, Any],
        target: Dict[str, Any],
        path: str = ""
    ) -> Tuple[List[Dict[str, Any]], bool]:
        """
        Compare two configuration dictionaries
        Returns: (list of differences, drift_detected)
        """
        differences = []
        drift_detected = False
        
        # Get all keys from both configs
        all_keys = set(source.keys()) | set(target.keys())
        
        for key in all_keys:
            current_path = f"{path}.{key}" if path else key
            
            # Key only in source
            if key not in target:
                differences.append({
                    "path": current_path,
                    "type": "removed",
                    "source_value": source[key],
                    "target_value": None,
                    "severity": "medium"
                })
                drift_detected = True
            
            # Key only in target
            elif key not in source:
                differences.append({
                    "path": current_path,
                    "type": "added",
                    "source_value": None,
                    "target_value": target[key],
                    "severity": "low"
                })
                drift_detected = True
            
            # Key in both - compare values
            else:
                source_val = source[key]
                target_val = target[key]
                
                # Both are dictionaries - recurse
                if isinstance(source_val, dict) and isinstance(target_val, dict):
                    nested_diffs, nested_drift = ComparisonService.compare_configs(
                        source_val, target_val, current_path
                    )
                    differences.extend(nested_diffs)
                    drift_detected = drift_detected or nested_drift
                
                # Both are lists - compare
                elif isinstance(source_val, list) and isinstance(target_val, list):
                    if source_val != target_val:
                        differences.append({
                            "path": current_path,
                            "type": "modified",
                            "source_value": source_val,
                            "target_value": target_val,
                            "severity": "medium"
                        })
                        drift_detected = True
                
                # Different types or different values
                elif source_val != target_val:
                    differences.append({
                        "path": current_path,
                        "type": "modified",
                        "source_value": source_val,
                        "target_value": target_val,
                        "severity": "medium"
                    })
                    drift_detected = True
        
        return differences, drift_detected
    
    @staticmethod
    def generate_summary(differences: List[Dict[str, Any]]) -> str:
        """Generate a human-readable summary of differences"""
        if not differences:
            return "No differences found. Configurations are identical."
        
        added = sum(1 for d in differences if d["type"] == "added")
        removed = sum(1 for d in differences if d["type"] == "removed")
        modified = sum(1 for d in differences if d["type"] == "modified")
        
        summary_parts = []
        if added > 0:
            summary_parts.append(f"{added} setting(s) added")
        if removed > 0:
            summary_parts.append(f"{removed} setting(s) removed")
        if modified > 0:
            summary_parts.append(f"{modified} setting(s) modified")
        
        return f"Configuration drift detected: {', '.join(summary_parts)}. Total differences: {len(differences)}"

