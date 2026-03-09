import os
import re

def update_pmn_in_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # Determine if it's a subdirectory file (path adjustments)
    prefix = '../' if ('branches' in filepath or 'blog\\' in filepath or 'blog/' in filepath) else ''
    if filepath.endswith('index.html'):
        return

    # Extract the CTA block. It might be <a href="book.html"... or <a href="../book.html"...
    # We will just find it and remove it from its current location
    
    # We need to remove it from <nav aria-label="Mobile navigation">...
    # Look for:
    #                 <!-- CTA -->
    #                 <a href="book.html" class="pmn-cta">
    #                     <span class="material-icons">calendar_today</span>
    #                     Book an Appointment
    #                 </a>
    
    cta_pattern_regex = r"(\s*<!-- CTA -->\s*)<a href=\"[\.\/]*book\.html\" class=\"pmn-cta\">\s*<span class=\"material-icons\">calendar_today<\/span>\s*Book an\s*Appointment\s*<\/a>\s*"
    
    match = re.search(cta_pattern_regex, content)
    
    if not match:
        # maybe it's already removed, or format differs
        print(f"Skipping {filepath} - couldn't find CTA block")
        return

    # Remove the CTA but keep the <!-- CTA --> comment if we want, or remove it too.
    # The user kept "<!-- CTA -->\n\n        <div class="pmn-section-label">Navigation</div>" in index.html
    new_content = re.sub(cta_pattern_regex, r"\1\n", content, count=1)
    
    # Now we insert it above </div><!-- /pmn-body -->
    # Find: </div><!-- /pmn-body -->
    # and replace with the button + </div><!-- /pmn-body -->
    
    button_html = f"""
      <a href="{prefix}book.html" class="pmn-cta">
        <span class="material-icons">calendar_today</span>
        Book an Appointment
      </a>

    </div><!-- /pmn-body -->"""
    
    # Notice some files might have </div><!-- /pmn-body --> with different spacing
    new_content = re.sub(r"\s*<\/div>\s*<!-- \/pmn-body -->", button_html, new_content, count=1)
    
    # If anything changed, write it
    if new_content != content:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print(f"Updated {filepath}")
    else:
        print(f"No changes made to {filepath}")

def main():
    directory = r'd:\Dental\smilecraft\SmileCraft'
    for root, dirs, files in os.walk(directory):
        for file in files:
            if file.endswith('.html'):
                update_pmn_in_file(os.path.join(root, file))

if __name__ == '__main__':
    main()
