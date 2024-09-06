(function ($) {
    $(window).adaptTo("foundation-registry").register("foundation.validation.validator", {

        selector: '[name="./jcr:content/metadata/cq:tags"]',
        validate: function (element) {

            const wrapper = $(element).parents().eq(1);

            // Apply only if schema is wknd-default
            if (!wrapper?.attr('data-path')?.startsWith('/conf/global/settings/dam/adminui-extension/metadataschema/stargate')) return;

            // Min 3 characters, first being capital letter, others being alphabetical characters

            setInterval(() => {
                //hiding the deselect button:
                document.querySelector('[name="./jcr:content/metadata/cq:tags"]').querySelector("span.coral-InputGroup-button").addEventListener('click', () => {
                    let deselectInterval = setInterval(() => {
                        if (document.querySelector('coral-dialog.foundation-picker-collection.is-open')) {
                            if (document.querySelector("button.granite-collection-deselect")) {
                                document.querySelector("button.granite-collection-deselect").style.display = "none";
                            }
                            let heading = document.querySelector('coral-dialog.foundation-picker-collection.is-open').querySelector('betty-titlebar-title');
                            let titlebar = document.querySelector('coral-dialog.foundation-picker-collection.is-open').querySelector('betty-titlebar');
                            let titlebarPrimary = document.querySelector('coral-dialog.foundation-picker-collection.is-open').querySelector('betty-titlebar-primary');
                            let titlebarSecondary = document.querySelector('coral-dialog.foundation-picker-collection.is-open').querySelector('betty-titlebar-secondary');
                            titlebarPrimary.style.maxWidth = "4%";

                            //creating div to show updated taglist:
                            if (!heading.parentNode.querySelector("betty-titlebar-title.updatedTags")) {
                                const box = document.createElement('betty-titlebar-title');
                                box.classList.add("updatedTags");
                                let boxWidth = titlebar.offsetWidth - titlebarPrimary.offsetWidth - titlebarSecondary.querySelector("div.shell-collection-sortcontainer").offsetWidth - heading.offsetWidth - 100;
                                box.style.width = `${boxWidth}px`;
                                window.addEventListener('resize', () => {
                                    let boxWidth = titlebar.offsetWidth - titlebarPrimary.offsetWidth - titlebarSecondary.querySelector("div.shell-collection-sortcontainer").offsetWidth - heading.offsetWidth - 100;
                                    box.style.width = `${boxWidth}px`;
                                });

                                adjustBoxWidth(box, heading, titlebar, titlebarPrimary, titlebarSecondary);

                                box.style.padding = "4px";
                                box.style.paddingBottom = "8px";
                                box.style.backgroundColor = "white";
                                heading.parentNode.insertBefore(box, titlebarPrimary);
                                box.style.height = "40px";
                                titlebar.style.height = "65px";
                                box.style.overflowX = "scroll";

                                box.style.textWrap = "nowrap";
                                box.addEventListener("wheel", function (e) {
                                    if (e.deltaY > 0 || e.deltaX > 0) box.scrollLeft += 50;
                                    else box.scrollLeft -= 50;
                                });
                            }
                            if (!heading.parentNode.querySelector("betty-titlebar-title.selected")) {
                                const selectHeading = document.createElement('betty-titlebar-title');
                                selectHeading.classList.add("selected");
                                selectHeading.style.width = "60px";
                                selectHeading.appendChild(document.createElement("h4"));
                                selectHeading.querySelector("h4").innerText = "Selected : ";
                                heading.parentNode.insertBefore(selectHeading, document.querySelector("betty-titlebar-title.updatedTags"));
                            }

                            clearInterval(deselectInterval);
                        }

                    }, 10);

                });

                let selected = new Set(document.querySelectorAll(".is-selected.foundation-collection-item"));
                selected.forEach((elem) => {
                    let text = elem.getAttribute("data-foundation-picker-collection-item-value").replace("Asset", "").split(" ").join("").toLowerCase();
                    let toUpdate = document.querySelector('[name="./jcr:content/metadata/cq:tags"]');
                    if (toUpdate.querySelector("coral-taglist").querySelectorAll("coral-tag").length == 0) {
                        const coralTag = document.createElement('coral-tag');
                        coralTag.setAttribute('closable', '');
                        coralTag.className = '_coral-Tags-item _coral-Tags-item--deletable';
                        coralTag.setAttribute('value', `${text}`);
                        coralTag.setAttribute('size', 'S');
                        coralTag.setAttribute('role', 'row');
                        coralTag.setAttribute('aria-labelledby', 'coral-id-960');
                        coralTag.setAttribute('tabindex', '0');

                        const coralTagLabel = document.createElement('coral-tag-label');
                        coralTagLabel.className = '_coral-Tags-itemLabel';
                        coralTagLabel.setAttribute('role', 'rowheader');
                        coralTagLabel.id = 'coral-id-960';
                        coralTagLabel.textContent = `${elem.getAttribute("data-foundation-picker-collection-item-text")}`;

                        coralTag.appendChild(coralTagLabel);

                        const input = document.createElement('input');
                        input.type = 'hidden';
                        input.setAttribute('handle', 'input');
                        input.name = './jcr:content/metadata/cq:tags';
                        input.value = `${text}`;
                        coralTag.appendChild(input);
                        const buttonSpan = document.createElement('span');
                        buttonSpan.setAttribute('handle', 'buttonCell');
                        buttonSpan.setAttribute('role', 'gridcell');
                        const button = document.createElement('button');
                        button.setAttribute('is', 'coral-button');
                        button.setAttribute('tracking', 'off');
                        button.setAttribute('handle', 'button');
                        button.type = 'button';
                        button.className = '_coral-ClearButton _coral-ClearButton--small _coral-Tags-item-removeButton';
                        button.title = 'Remove';
                        button.setAttribute('tabindex', '0');
                        button.setAttribute('coral-close', '');
                        button.setAttribute('aria-label', 'Remove: Asset Properties : Style / Color');
                        button.setAttribute('size', 'M');

                        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
                        svg.setAttribute('focusable', 'false');
                        svg.setAttribute('aria-hidden', 'true');
                        svg.setAttribute("class", '_coral-Icon--svg _coral-Icon _coral-UIIcon-CrossSmall');

                        const use = document.createElementNS('http://www.w3.org/2000/svg', 'use');
                        use.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href', '#spectrum-css-icon-CrossSmall');

                        svg.appendChild(use);

                        button.appendChild(svg);

                        const coralButtonLabel = document.createElement('coral-button-label');
                        coralButtonLabel.setAttribute('handle', 'buttonLabel');

                        button.appendChild(coralButtonLabel);

                        buttonSpan.appendChild(button);

                        coralTag.appendChild(buttonSpan);

                        toUpdate.querySelector("coral-taglist").appendChild(coralTag);
                    } else {
                        let clone = toUpdate.querySelector("coral-taglist").querySelector("coral-tag").cloneNode(true);
                        clone.setAttribute("value", text);

                        clone.querySelector("input").setAttribute("value", text);
                        clone.querySelector("coral-tag-label").innerText = `${elem.getAttribute("data-foundation-picker-collection-item-text")}`;

                        toUpdate.querySelector("coral-taglist").appendChild(clone);
                    }
                    elem.querySelector("coral-checkbox").addEventListener("click", () => {
                        if (elem.querySelector("coral-checkbox").checked)
                            toUpdate.querySelector("coral-taglist").removeChild(toUpdate.querySelector("coral-taglist").querySelector(`[value="${text}"]`))

                    });

                });

                let updatedTagList = document.querySelector('[name="./jcr:content/metadata/cq:tags"]');
                let values = [];

                updatedTagList.querySelector("coral-taglist").querySelectorAll("coral-tag").forEach((tag) => {
                    values.push(tag.getAttribute("value"));
                });

                //deleting the duplicate values...
                updatedTagList.querySelector("coral-taglist").querySelectorAll("coral-tag").forEach((tag) => {
                    let count = 0;
                    values.forEach((item) => {
                        let value1 = tag.getAttribute("value").replaceAll(":", "").replaceAll("-", "").replaceAll("/", "").replaceAll("asset", "").replaceAll("_", "")
                        let value2 = item.replaceAll(":", "").replaceAll("-", "").replaceAll("/", "").replaceAll("asset", "").replaceAll("_", "")

                        if (value1 == value2)
                            count++;
                    })
                    if (count >= 2) {
                        let index = values.indexOf(tag.getAttribute("value"))
                        values.splice(index, 1)
                        tag.parentNode.removeChild(tag)
                    }

                });

                if (document.querySelector("betty-titlebar-title.updatedTags") && document.querySelector("betty-titlebar-title.updatedTags").querySelectorAll("coral-tag").length != values.length) {
                    //updating values of selected tags in updatedTagList box:
                    document.querySelector("betty-titlebar-title.updatedTags").innerHTML = "";
                    values.forEach((value) => {
                        const valueTag = document.createElement('coral-tag');
                        valueTag.innerText = value;
                        if (document.querySelector("betty-titlebar-title.updatedTags") && value != "")
                            document.querySelector("betty-titlebar-title.updatedTags").appendChild(valueTag);
                    });
                }

            }, 1000);

        }
    });

    /*
    Using a MutationObserver to monitor changes to the heading text in the title bar of the dialog.
    When the heading text changes, this function adjusts the width of the box to fit in the dialog without disturbing the UI.
    */
    const adjustBoxWidth = (box, heading, titlebar, titlebarPrimary, titlebarSecondary) => {
        const targetNode = heading;
        const config = {
            childList: true,
            subtree: true,
            attributes: true,
            characterData: true
        };
        const callback = (mutationsList) => {
            for (const mutation of mutationsList) {
                if (mutation.type === 'childList' || mutation.type === 'attributes' || mutation.type === 'characterData') {
                    let boxWidth = titlebar.offsetWidth - titlebarPrimary.offsetWidth - titlebarSecondary.querySelector("div.shell-collection-sortcontainer").offsetWidth - heading.offsetWidth - 100;
                    box.style.width = `${boxWidth}px`;
                }
            }
        };
        const observer = new MutationObserver(callback);
        observer.observe(targetNode, config);
    }

})(Granite.$);
