(function ($) {
    $(window).adaptTo("foundation-registry").register("foundation.validation.validator", {

        selector: '[name="./jcr:content/metadata/cq:tags"]',
        validate: function (element) {
            const wrapper = $(element).parents().eq(1);
            if (!isApplicableSchema(wrapper)) return;
            initTagUpdateInterval(element);
        }
    });

    // Check if the schema is wknd-default
    function isApplicableSchema(wrapper) {
        return wrapper?.attr('data-path')?.startsWith('/conf/global/settings/dam/adminui-extension/metadataschema/stargate');
    }

    // Initialize the interval for tag updates
    function initTagUpdateInterval(element) {
        setInterval(() => {
            setupDeselectButton(element);
            handleSelectedTags(element);
        }, 1000);
    }

    // Hides the deselect button and adjusts the dialog UI
    function setupDeselectButton(element) {
        const deselectButton = document.querySelector('[name="./jcr:content/metadata/cq:tags"]')
            .querySelector("span.coral-InputGroup-button");

        deselectButton.addEventListener('click', () => {
            const deselectInterval = setInterval(() => {
                const dialog = document.querySelector('coral-dialog.foundation-picker-collection.is-open');
                if (dialog) {
                    hideDeselectButton(dialog);
                    setupUpdatedTagList(dialog);
                    clearInterval(deselectInterval);
                }
            }, 10);
        });
    }

    // Hide the deselect button in the tag picker dialog
    function hideDeselectButton(dialog) {
        const deselectButton = dialog.querySelector("button.granite-collection-deselect");
        if (deselectButton) {
            deselectButton.style.display = "none";
        }
    }

    // Setup the UI to display updated tag list in the dialog
    function setupUpdatedTagList(dialog) {
        const heading = dialog.querySelector('betty-titlebar-title');
        const titlebar = dialog.querySelector('betty-titlebar');
        const titlebarPrimary = dialog.querySelector('betty-titlebar-primary');
        const titlebarSecondary = dialog.querySelector('betty-titlebar-secondary');
        titlebarPrimary.style.maxWidth = "4%";

        createUpdatedTagBox(heading, titlebar, titlebarPrimary, titlebarSecondary);
        createSelectedTagsHeading(heading);
    }

    // Create the updated tag box UI element
    function createUpdatedTagBox(heading, titlebar, titlebarPrimary, titlebarSecondary) {
        if (!heading.parentNode.querySelector("betty-titlebar-title.updatedTags")) {
            const box = document.createElement('betty-titlebar-title');
            box.classList.add("updatedTags");
            setBoxWidth(box, heading, titlebar, titlebarPrimary, titlebarSecondary);

            box.style.padding = "4px";
            box.style.paddingBottom = "8px";
            box.style.backgroundColor = "white";
            heading.parentNode.insertBefore(box, titlebarPrimary);

            box.style.height = "40px";
            titlebar.style.height = "65px";
            box.style.overflowX = "scroll";
            setupScrollEvent(box);
        }
    }

    // Set the width of the tag box and listen for window resize
    function setBoxWidth(box, heading, titlebar, titlebarPrimary, titlebarSecondary) {
        let boxWidth = calculateBoxWidth(titlebar, titlebarPrimary, titlebarSecondary, heading);
        box.style.width = `${boxWidth}px`;

        window.addEventListener('resize', () => {
            boxWidth = calculateBoxWidth(titlebar, titlebarPrimary, titlebarSecondary, heading);
            box.style.width = `${boxWidth}px`;
        });
    }

    // Calculate the width for the updated tag box
    function calculateBoxWidth(titlebar, titlebarPrimary, titlebarSecondary, heading) {
        return titlebar.offsetWidth - titlebarPrimary.offsetWidth - titlebarSecondary.querySelector("div.shell-collection-sortcontainer").offsetWidth - heading.offsetWidth - 100;
    }

    // Set up the scroll event for the tag box
    function setupScrollEvent(box) {
        box.addEventListener("wheel", function (e) {
            box.scrollLeft += (e.deltaY > 0 || e.deltaX > 0) ? 50 : -50;
        });
    }

    // Create the selected tags heading element
    function createSelectedTagsHeading(heading) {
        if (!heading.parentNode.querySelector("betty-titlebar-title.selected")) {
            const selectHeading = document.createElement('betty-titlebar-title');
            selectHeading.classList.add("selected");
            selectHeading.style.width = "60px";
            const h4 = document.createElement("h4");
            h4.innerText = "Selected : ";
            selectHeading.appendChild(h4);
            heading.parentNode.insertBefore(selectHeading, document.querySelector("betty-titlebar-title.updatedTags"));
        }
    }

    // Handle the selected tags and update the tag list
    function handleSelectedTags(element) {
        const selectedItems = new Set(document.querySelectorAll(".is-selected.foundation-collection-item"));

        selectedItems.forEach((elem) => {
            const text = elem.getAttribute("data-foundation-picker-collection-item-value")
                .replace("Asset", "").split(" ").join("").toLowerCase();
            updateTagList(element, elem, text);
            addCheckboxEventListener(elem, text);
        });

        updateDisplayedTagList();
    }

    // Update the tag list in the UI
    function updateTagList(element, elem, text) {
        const tagList = element.querySelector("coral-taglist");
        if (tagList.querySelectorAll("coral-tag").length == 0) {
            createTag(tagList, elem, text);
        } else {
            let clone = tagList.querySelector("coral-tag").cloneNode(true);
            clone.setAttribute("value", text);
            clone.querySelector("input").setAttribute("value", text);
            clone.querySelector("coral-tag-label").innerText = elem.getAttribute("data-foundation-picker-collection-item-text");
            tagList.appendChild(clone);
        }
    }

    // Add event listener to handle deselection of tags
    function addCheckboxEventListener(elem, text) {
        elem.querySelector("coral-checkbox").addEventListener("click", () => {
            const tagList = document.querySelector('[name="./jcr:content/metadata/cq:tags"]').querySelector("coral-taglist");
            if (elem.querySelector("coral-checkbox").checked) {
                tagList.removeChild(tagList.querySelector(`[value="${text}"]`));
            }
        });
    }

    // Create a tag and append to the tag list
    function createTag(tagList, elem, text) {
        const coralTag = document.createElement('coral-tag');
        coralTag.setAttribute('closable', '');
        coralTag.className = '_coral-Tags-item _coral-Tags-item--deletable';
        coralTag.setAttribute('value', text);
        coralTag.setAttribute('size', 'S');
        coralTag.setAttribute('role', 'row');

        const coralTagLabel = document.createElement('coral-tag-label');
        coralTagLabel.className = '_coral-Tags-itemLabel';
        coralTagLabel.setAttribute('role', 'rowheader');
        coralTagLabel.textContent = elem.getAttribute("data-foundation-picker-collection-item-text");
        coralTag.appendChild(coralTagLabel);

        const input = document.createElement('input');
        input.type = 'hidden';
        input.name = './jcr:content/metadata/cq:tags';
        input.value = text;
        coralTag.appendChild(input);

        createRemoveButton(coralTag);
        tagList.appendChild(coralTag);
    }

    // Create the remove button for the tags
    function createRemoveButton(coralTag) {
        const buttonSpan = document.createElement('span');
        buttonSpan.setAttribute('handle', 'buttonCell');
        buttonSpan.setAttribute('role', 'gridcell');

        const button = document.createElement('button');
        button.setAttribute('is', 'coral-button');
        button.className = '_coral-ClearButton _coral-ClearButton--small _coral-Tags-item-removeButton';
        button.title = 'Remove';
        button.type = 'button';
        button.setAttribute('coral-close', '');

        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute('focusable', 'false');
        svg.setAttribute('aria-hidden', 'true');
        svg.setAttribute("class", '_coral-Icon--svg _coral-Icon _coral-UIIcon-CrossSmall');

        const use = document.createElementNS('http://www.w3.org/1999/xlink', 'use');
        use.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href', '#spectrum-css-icon-CrossSmall');

        svg.appendChild(use);
        button.appendChild(svg);
        buttonSpan.appendChild(button);
        coralTag.appendChild(buttonSpan);
    }

    // Update the displayed tag list in the UI
    function updateDisplayedTagList() {
        const tagList = document.querySelector('[name="./jcr:content/metadata/cq:tags"]');
        const values = Array.from(tagList.querySelectorAll("coral-tag")).map(tag => tag.getAttribute("value"));

        tagList.querySelectorAll("coral-tag").forEach(tag => {
            const value = tag.getAttribute("value");
            if (values.filter(val => val === value).length > 1) {
tag.remove();
}
});
}

})(Granite.$);
