
import os

file_paths = [
    '/Users/devoop/Dev/personal/mbinga/mbinga/src/app/icon.svg',
    '/Users/devoop/Dev/personal/mbinga/mbinga/public/images/logo.svg'
]

hole_identifiers = [
    'transform="translate(866,850)"',
    'transform="translate(866,702)"',
    'transform="translate(2102,729)"'
]

def process_file(file_path):
    print(f"Processing {file_path}...")
    try:
        with open(file_path, 'r') as f:
            lines = f.readlines()
    except FileNotFoundError:
        print(f"File not found: {file_path}")
        return

    header = []
    footer = []
    content_paths = []
    hole_paths = []

    # Simple parsing assuming standard format from previous reads
    # <svg ...> is header
    # </svg> is footer
    # <path ...> are paths

    for line in lines:
        if '<svg' in line or '<?xml' in line or ('<path' not in line and '</svg>' not in line and line.strip()):
            header.append(line)
        elif '</svg>' in line:
            footer.append(line)
        elif '<path' in line:
            # Check if it's a hole path
            is_hole = False
            for ident in hole_identifiers:
                if ident in line:
                    is_hole = True
                    break
            
            if is_hole:
                # Change fill to black for mask
                # Replace fill="#..." with fill="black"
                import re
                new_line = re.sub(r'fill="[^"]+"', 'fill="black"', line)
                if 'fill=' not in new_line: # If no fill attr, add it
                     new_line = new_line.replace('<path', '<path fill="black"')
                hole_paths.append(new_line)
            else:
                content_paths.append(line)

    # Reconstruct
    new_lines = []
    new_lines.extend(header)
    
    # Add Mask Defs
    new_lines.append('<defs>\n')
    new_lines.append('<mask id="m">\n')
    new_lines.append('<rect width="100%" height="100%" fill="white"/>\n')
    new_lines.extend(hole_paths)
    new_lines.append('</mask>\n')
    new_lines.append('</defs>\n')
    
    # Add Content wrapped in Group
    new_lines.append('<g mask="url(#m)">\n')
    new_lines.extend(content_paths)
    new_lines.append('</g>\n')
    
    new_lines.extend(footer)

    with open(file_path, 'w') as f:
        f.writelines(new_lines)
    print(f"Done {file_path}")

for fp in file_paths:
    process_file(fp)
