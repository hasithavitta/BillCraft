/* =========================================================
   BILLCRAFT - INVOICE GENERATOR
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    /* =====================================================
       ELEMENTS
    ===================================================== */

    const itemsContainer = document.getElementById("itemsContainer");
    const addItemBtn = document.getElementById("addItemBtn");
    const clearInvoiceBtn = document.getElementById("clearInvoiceBtn");
    const generateInvoiceBtn = document.getElementById("generateInvoiceBtn");
    const printInvoiceBtn = document.getElementById("printInvoiceBtn");
    const downloadPdfBtn = document.getElementById("downloadPdfBtn");
    const invoiceStatus = document.getElementById("invoiceStatus");

    const businessName = document.getElementById("businessName");
    const businessEmail = document.getElementById("businessEmail");
    const businessPhone = document.getElementById("businessPhone");
    const businessAddress = document.getElementById("businessAddress");

    const clientName = document.getElementById("clientName");
    const clientEmail = document.getElementById("clientEmail");
    const clientPhone = document.getElementById("clientPhone");
    const clientAddress = document.getElementById("clientAddress");

    const invoiceNumber = document.getElementById("invoiceNumber");
    const invoiceDate = document.getElementById("invoiceDate");
    const dueDate = document.getElementById("dueDate");
    const currency = document.getElementById("currency");

    const taxRate = document.getElementById("taxRate");
    const discountRate = document.getElementById("discountRate");

    const invoiceNotes = document.getElementById("invoiceNotes");


    /* =====================================================
       PREVIEW ELEMENTS
    ===================================================== */

    const previewInvoiceNumber =
        document.getElementById("previewInvoiceNumber");

    const previewBusinessName =
        document.getElementById("previewBusinessName");

    const previewBusinessName2 =
        document.getElementById("previewBusinessName2");

    const previewBusinessEmail =
        document.getElementById("previewBusinessEmail");

    const previewBusinessPhone =
        document.getElementById("previewBusinessPhone");

    const previewBusinessAddress =
        document.getElementById("previewBusinessAddress");

    const previewClientName =
        document.getElementById("previewClientName");

    const previewClientEmail =
        document.getElementById("previewClientEmail");

    const previewClientAddress =
        document.getElementById("previewClientAddress");

    const previewInvoiceDate =
        document.getElementById("previewInvoiceDate");

    const previewDueDate =
        document.getElementById("previewDueDate");

    const previewItems =
        document.getElementById("previewItems");

    const previewSubtotal =
        document.getElementById("previewSubtotal");

    const previewDiscount =
        document.getElementById("previewDiscount");

    const previewTax =
        document.getElementById("previewTax");

    const previewTotal =
        document.getElementById("previewTotal");

    const previewNotes =
        document.getElementById("previewNotes");


    /* =====================================================
       DEFAULT VALUES
    ===================================================== */

    const today = new Date();

    const formattedToday =
        today.toISOString().split("T")[0];

    invoiceDate.value = formattedToday;

    const defaultDueDate = new Date(today);

    defaultDueDate.setDate(
        defaultDueDate.getDate() + 7
    );

    dueDate.value =
        defaultDueDate.toISOString().split("T")[0];

    invoiceNotes.value =
        "Thank you for your business!";


    /* =====================================================
       UTILITY FUNCTIONS
    ===================================================== */

    function getCurrency() {
        return currency.value || "₹";
    }


    function formatMoney(amount) {

        return `${getCurrency()}${Number(amount).toLocaleString(
            "en-IN",
            {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            }
        )}`;

    }


    function formatDate(dateValue) {

        if (!dateValue) {
            return "—";
        }

        const date = new Date(dateValue + "T00:00:00");

        return date.toLocaleDateString(
            "en-IN",
            {
                day: "2-digit",
                month: "short",
                year: "numeric"
            }
        );

    }


    function getValue(element, fallback = "") {

        return element.value.trim() || fallback;

    }


    /* =====================================================
       UPDATE BASIC PREVIEW INFORMATION
    ===================================================== */

    function updateBasicPreview() {

        previewInvoiceNumber.textContent =
            `#${getValue(invoiceNumber, "INV-001")}`;


        const business =
            getValue(businessName, "Your Business");

        previewBusinessName.textContent =
            business;

        previewBusinessName2.textContent =
            business;


        previewBusinessEmail.textContent =
            getValue(
                businessEmail,
                "business@example.com"
            );


        previewBusinessPhone.textContent =
            getValue(
                businessPhone,
                "+91 98765 43210"
            );


        previewBusinessAddress.textContent =
            getValue(
                businessAddress,
                "Business Address"
            );


        previewClientName.textContent =
            getValue(
                clientName,
                "Client Name"
            );


        previewClientEmail.textContent =
            getValue(
                clientEmail,
                "client@example.com"
            );


        previewClientAddress.textContent =
            getValue(
                clientAddress,
                "Client Address"
            );


        previewInvoiceDate.textContent =
            formatDate(invoiceDate.value);


        previewDueDate.textContent =
            formatDate(dueDate.value);


        previewNotes.textContent =
            getValue(
                invoiceNotes,
                "Thank you for your business!"
            );

    }


    /* =====================================================
       CREATE NEW ITEM
    ===================================================== */

    function createItemRow() {

        const row =
            document.createElement("div");

        row.className = "item-row";


        row.innerHTML = `

            <div class="item-field item-description">

                <label>
                    Item / Service
                </label>

                <input
                    type="text"
                    class="item-name"
                    placeholder="e.g. Website Design"
                >

            </div>


            <div class="item-field">

                <label>
                    Quantity
                </label>

                <input
                    type="number"
                    class="item-quantity"
                    value="1"
                    min="1"
                >

            </div>


            <div class="item-field">

                <label>
                    Price
                </label>

                <input
                    type="number"
                    class="item-price"
                    placeholder="0.00"
                    min="0"
                    step="0.01"
                >

            </div>


            <div class="item-field item-total-field">

                <label>
                    Total
                </label>

                <input
                    type="text"
                    class="item-total"
                    value="${formatMoney(0)}"
                    readonly
                >

            </div>


            <button
                type="button"
                class="remove-item"
                title="Remove item"
            >
                <i class='bx bx-trash'></i>
            </button>

        `;


        itemsContainer.appendChild(row);

        attachItemEvents(row);

    }


    /* =====================================================
       ATTACH ITEM EVENTS
    ===================================================== */

    function attachItemEvents(row) {

        const quantity =
            row.querySelector(".item-quantity");

        const price =
            row.querySelector(".item-price");

        const removeButton =
            row.querySelector(".remove-item");


        quantity.addEventListener(
            "input",
            updateInvoice
        );


        price.addEventListener(
            "input",
            updateInvoice
        );


        removeButton.addEventListener(
            "click",
            () => {

                const rows =
                    itemsContainer.querySelectorAll(
                        ".item-row"
                    );

                /*
                 * Keep at least one item row.
                 */

                if (rows.length === 1) {

                    row.querySelector(
                        ".item-name"
                    ).value = "";

                    quantity.value = 1;
                    price.value = "";

                } else {

                    row.remove();

                }

                updateInvoice();

            }
        );

    }


    /* =====================================================
       CALCULATE ITEMS
    ===================================================== */

    function calculateItems() {

        const rows =
            itemsContainer.querySelectorAll(
                ".item-row"
            );


        let subtotal = 0;

        const items = [];


        rows.forEach(row => {

            const name =
                getValue(
                    row.querySelector(".item-name"),
                    "Item / Service"
                );


            const quantity =
                Math.max(
                    parseFloat(
                        row.querySelector(
                            ".item-quantity"
                        ).value
                    ) || 0,
                    0
                );


            const price =
                Math.max(
                    parseFloat(
                        row.querySelector(
                            ".item-price"
                        ).value
                    ) || 0,
                    0
                );


            const total =
                quantity * price;


            row.querySelector(
                ".item-total"
            ).value =
                formatMoney(total);


            subtotal += total;


            items.push({
                name,
                quantity,
                price,
                total
            });

        });


        return {
            subtotal,
            items
        };

    }


    /* =====================================================
       UPDATE PREVIEW ITEMS
    ===================================================== */

    function updatePreviewItems(items) {

        previewItems.innerHTML = "";


        if (items.length === 0) {

            previewItems.innerHTML = `

                <tr>

                    <td colspan="4">
                        No items added
                    </td>

                </tr>

            `;

            return;

        }


        items.forEach(item => {

            const row =
                document.createElement("tr");


            row.innerHTML = `

                <td>
                    ${escapeHTML(item.name)}
                </td>

                <td>
                    ${item.quantity}
                </td>

                <td>
                    ${formatMoney(item.price)}
                </td>

                <td>
                    ${formatMoney(item.total)}
                </td>

            `;


            previewItems.appendChild(row);

        });

    }


    /* =====================================================
       CALCULATE TOTALS
    ===================================================== */

    function calculateTotals(subtotal) {

        const discountPercentage =
            Math.max(
                parseFloat(discountRate.value) || 0,
                0
            );


        const taxPercentage =
            Math.max(
                parseFloat(taxRate.value) || 0,
                0
            );


        const discountAmount =
            subtotal *
            (discountPercentage / 100);


        const amountAfterDiscount =
            Math.max(
                subtotal - discountAmount,
                0
            );


        const taxAmount =
            amountAfterDiscount *
            (taxPercentage / 100);


        const total =
            amountAfterDiscount + taxAmount;


        return {
            discountAmount,
            taxAmount,
            total
        };

    }

    /* =====================================================
   VALIDATE INVOICE
===================================================== */

function validateInvoice() {

    const errors = [];


    /*
     * Business name
     */

    if (!businessName.value.trim()) {

        errors.push(
            "Enter your business name."
        );

    }


    /*
     * Client name
     */

    if (!clientName.value.trim()) {

        errors.push(
            "Enter the client name."
        );

    }


    /*
     * Invoice number
     */

    if (!invoiceNumber.value.trim()) {

        errors.push(
            "Enter an invoice number."
        );

    }


    /*
     * Validate invoice items
     */

    const rows =
        itemsContainer.querySelectorAll(
            ".item-row"
        );


    let hasValidItem = false;


    rows.forEach(row => {

        const name =
            row.querySelector(
                ".item-name"
            ).value.trim();


        const quantity =
            parseFloat(
                row.querySelector(
                    ".item-quantity"
                ).value
            ) || 0;


        const price =
            parseFloat(
                row.querySelector(
                    ".item-price"
                ).value
            ) || 0;


        if (
            name &&
            quantity > 0 &&
            price > 0
        ) {

            hasValidItem = true;

        }

    });


    if (!hasValidItem) {

        errors.push(
            "Add at least one item with a description and price."
        );

    }


    return errors;

}

/* =====================================================
   SHOW INVOICE STATUS
===================================================== */

function showInvoiceStatus(message, type) {

    invoiceStatus.textContent = message;

    invoiceStatus.className =
        `invoice-status ${type}`;

}


    /* =====================================================
       UPDATE COMPLETE INVOICE
    ===================================================== */

    function updateInvoice() {

        updateBasicPreview();


        const {
            subtotal,
            items
        } = calculateItems();


        const {
            discountAmount,
            taxAmount,
            total
        } = calculateTotals(subtotal);


        updatePreviewItems(items);


        previewSubtotal.textContent =
            formatMoney(subtotal);


        previewDiscount.textContent =
            formatMoney(discountAmount);


        previewTax.textContent =
            formatMoney(taxAmount);


        previewTotal.textContent =
            formatMoney(total);

    }


    /* =====================================================
       ESCAPE HTML
    ===================================================== */

    function escapeHTML(value) {

        const div =
            document.createElement("div");

        div.textContent = value;

        return div.innerHTML;

    }


    /* =====================================================
       ADD ITEM
    ===================================================== */

    addItemBtn.addEventListener(
        "click",
        () => {

            createItemRow();

            updateInvoice();

        }
    );


    /* =====================================================
       LIVE FORM UPDATES
    ===================================================== */

    const liveFields = [

        businessName,
        businessEmail,
        businessPhone,
        businessAddress,

        clientName,
        clientEmail,
        clientPhone,
        clientAddress,

        invoiceNumber,
        invoiceDate,
        dueDate,

        currency,

        taxRate,
        discountRate,

        invoiceNotes

    ];


    liveFields.forEach(field => {

        field.addEventListener(
            "input",
            updateInvoice
        );


        field.addEventListener(
            "change",
            updateInvoice
        );

    });


    /* =====================================================
       ATTACH EVENTS TO INITIAL ITEM
    ===================================================== */

    const initialItem =
        itemsContainer.querySelector(
            ".item-row"
        );


    if (initialItem) {
        attachItemEvents(initialItem);
    }


    /* =====================================================
       CLEAR INVOICE
    ===================================================== */

    clearInvoiceBtn.addEventListener(
        "click",
        () => {

            const confirmed =
                confirm(
                    "Are you sure you want to clear the invoice?"
                );


            if (!confirmed) {
                return;
            }


            /*
             * Clear business details
             */

            businessName.value = "";
            businessEmail.value = "";
            businessPhone.value = "";
            businessAddress.value = "";


            /*
             * Clear client details
             */

            clientName.value = "";
            clientEmail.value = "";
            clientPhone.value = "";
            clientAddress.value = "";


            /*
             * Reset invoice information
             */

            invoiceNumber.value = "INV-001";

            invoiceDate.value =
                formattedToday;

            dueDate.value =
                defaultDueDate
                    .toISOString()
                    .split("T")[0];


            currency.value = "₹";


            /*
             * Reset items
             */

            itemsContainer.innerHTML = "";


            createItemRow();


            /*
             * Reset tax and discount
             */

            taxRate.value = 0;
            discountRate.value = 0;


            /*
             * Reset notes
             */

            invoiceNotes.value =
                "Thank you for your business!";


            updateInvoice();

            printInvoiceBtn.disabled = true;
            downloadPdfBtn.disabled = true;

            invoiceStatus.textContent = "";
            invoiceStatus.className = "invoice-status";

        }
    );


/* =====================================================
   GENERATE INVOICE
===================================================== */

generateInvoiceBtn.addEventListener(
    "click",
    () => {

        /*
         * Validate the invoice first.
         */

        const errors =
            validateInvoice();


        if (errors.length > 0) {

            showInvoiceStatus(
                errors[0],
                "error"
            );

            /*
             * Scroll to the first relevant area
             * on smaller screens.
             */

            if (window.innerWidth <= 1100) {

                document
                    .getElementById("invoice")
                    .scrollIntoView({
                        behavior: "smooth",
                        block: "start"
                    });

            }

            return;

        }


        /*
         * Calculate everything again
         * before generating.
         */

        updateInvoice();


        /*
         * Enable Print Invoice.
         */

        printInvoiceBtn.disabled = false;
        downloadPdfBtn.disabled = false;


        /*
         * Show success message.
         */

        showInvoiceStatus(
            "✓ Invoice generated successfully. You can now print or save it as a PDF.",
            "success"
        );


        /*
         * Bring the preview into view
         * on smaller screens.
         */

        if (window.innerWidth <= 1100) {

            document
                .getElementById("invoicePreview")
                .scrollIntoView({
                    behavior: "smooth",
                    block: "start"
                });

        }

    }
);


    /* =====================================================
       PRINT INVOICE
    ===================================================== */

    printInvoiceBtn.addEventListener(
        "click",
        () => {

            updateInvoice();

            window.print();

        }
    );

    /* =====================================================
   DOWNLOAD INVOICE AS PDF
===================================================== */

downloadPdfBtn.addEventListener(
    "click",
    async () => {

        /*
         * Make sure the invoice has been generated.
         */

        if (downloadPdfBtn.disabled) {
            return;
        }


        /*
         * Check that the PDF libraries loaded.
         */

        if (
            typeof html2canvas === "undefined" ||
            typeof window.jspdf === "undefined"
        ) {

            showInvoiceStatus(
                "PDF libraries could not be loaded. Please refresh the page and try again.",
                "error"
            );

            return;
        }


        const invoice =
            document.getElementById(
                "invoicePreview"
            );


        showInvoiceStatus(
            "Preparing your PDF...",
            "success"
        );


        try {

            /*
             * Convert invoice preview to canvas.
             */

            const canvas =
                await html2canvas(
                    invoice,
                    {
                        scale: 2,
                        backgroundColor: "#ffffff",
                        useCORS: true,
                        logging: false
                    }
                );


            const imageData =
                canvas.toDataURL(
                    "image/png"
                );


            /*
             * Create PDF.
             */

            const {
                jsPDF
            } = window.jspdf;


            const pdf =
                new jsPDF({
                    orientation: "portrait",
                    unit: "mm",
                    format: "a4"
                });


            const pageWidth =
                pdf.internal.pageSize.getWidth();

            const pageHeight =
                pdf.internal.pageSize.getHeight();


            const margin = 10;


            const usableWidth =
                pageWidth - (margin * 2);


            const imageRatio =
                canvas.height /
                canvas.width;


            const imageHeight =
                usableWidth * imageRatio;


            /*
             * Fit the invoice onto A4.
             */

            if (
                imageHeight <=
                pageHeight - (margin * 2)
            ) {

                pdf.addImage(
                    imageData,
                    "PNG",
                    margin,
                    margin,
                    usableWidth,
                    imageHeight
                );

            } else {

                const maxHeight =
                    pageHeight - (margin * 2);


                const scale =
                    maxHeight / imageHeight;


                const finalWidth =
                    usableWidth * scale;


                pdf.addImage(
                    imageData,
                    "PNG",
                    margin,
                    margin,
                    finalWidth,
                    maxHeight
                );

            }


            /*
             * Create filename.
             */

            const number =
                getValue(
                    invoiceNumber,
                    "INV-001"
                );


            const safeNumber =
                number.replace(
                    /[^a-zA-Z0-9-_]/g,
                    "-"
                );


            pdf.save(
                `BillCraft-${safeNumber}.pdf`
            );


            showInvoiceStatus(
                "✓ PDF downloaded successfully.",
                "success"
            );


        } catch (error) {

            console.error(
                "PDF generation error:",
                error
            );


            showInvoiceStatus(
                "Unable to generate the PDF. Please try again.",
                "error"
            );

        }

    }
);

    /* =====================================================
       INITIAL UPDATE
    ===================================================== */

    updateInvoice();

});

/* =========================================================
   FAQ ACCORDION
========================================================= */

const faqItems =
    document.querySelectorAll(".faq-item");


faqItems.forEach(item => {

    const question =
        item.querySelector(".faq-question");


    question.addEventListener(
        "click",
        () => {

            const isActive =
                item.classList.contains("active");


            /*
             * Close all FAQ items
             */

            faqItems.forEach(faqItem => {

                faqItem.classList.remove(
                    "active"
                );

            });


            /*
             * Open the clicked item
             * if it wasn't already open.
             */

            if (!isActive) {

                item.classList.add(
                    "active"
                );

            }

        }
    );

});

/* =========================================================
   CONTACT FORM
========================================================= */

const contactForm =
    document.getElementById("contactForm");

const contactStatus =
    document.getElementById("contactStatus");


if (contactForm) {

    contactForm.addEventListener(
        "submit",
        (event) => {

            event.preventDefault();


            const name =
                document
                    .getElementById("contactName")
                    .value
                    .trim();


            const email =
                document
                    .getElementById("contactEmail")
                    .value
                    .trim();


            const subject =
                document
                    .getElementById("contactSubject")
                    .value
                    .trim();


            const message =
                document
                    .getElementById("contactMessage")
                    .value
                    .trim();


            /*
             * Basic validation
             */

            if (
                !name ||
                !email ||
                !subject ||
                !message
            ) {

                contactStatus.textContent =
                    "Please fill in all the fields.";

                contactStatus.className =
                    "contact-status error";

                return;

            }


            /*
             * Basic email validation
             */

            const emailPattern =
                /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


            if (
                !emailPattern.test(email)
            ) {

                contactStatus.textContent =
                    "Please enter a valid email address.";

                contactStatus.className =
                    "contact-status error";

                return;

            }


            /*
             * Frontend-only confirmation.
             *
             * No message is actually sent because
             * there is currently no backend/email service.
             */

            contactStatus.textContent =
                `Thanks ${name}! Your message has been prepared successfully.`;

            contactStatus.className =
                "contact-status success";


            /*
             * Reset the form after successful submission.
             */

            contactForm.reset();

        }
    );

}

/* =========================================================
   FOOTER
========================================================= */

const currentYear =
    document.getElementById("currentYear");

if (currentYear) {

    currentYear.textContent =
        new Date().getFullYear();

}


/* =========================================================
   BACK TO TOP
========================================================= */

const backToTop =
    document.getElementById("backToTop");


if (backToTop) {

    window.addEventListener(
        "scroll",
        () => {

            if (window.scrollY > 500) {

                backToTop.classList.add(
                    "visible"
                );

            } else {

                backToTop.classList.remove(
                    "visible"
                );

            }

        }
    );

}