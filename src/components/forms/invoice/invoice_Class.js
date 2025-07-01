class Invoice {
    constructor() {
        this.companyName = '';
        this.documentNumber = '';
        this.billto = {};
        this.total = null;
        this.services = []; // array of objects
        this.dueDate = null;
        this.todaysDate = null;
        this.memo = '';
        this.slogan = '';
        this.companyPhone = '';
        this.companyEmail = '';
        this.logoDataUrl = ''; 
        this.status = 'Open'; 
    }

    setDueDate(date) {
        this.dueDate = date;
    }

    setTodaysDate(date) {
        this.todaysDate = date;
    }

    setMemo(memo) {
        this.memo = memo;
    }

    setTotal(total) {    
        this.total = total;
    }

    setStatus(status) {
        this.status = status;
    }

    setCompanyName(companyName) {
        this.companyName = companyName;
    }

    setDocumentNumber(documentNumber) {
        this.documentNumber = documentNumber;
    }
    
    setBillto(billto) {
        let billToParts = billto.split('\n');
        let length = billToParts.length;
        if(length == 3) {
            this.billto = {
                name: billToParts[0],
                addr1: billToParts[1],
                cityStateZip: billToParts[2]
            }
        }
        else if(length == 4) {
            this.billto = {
                name: billToParts[0],
                addr1: billToParts[1],
                addr2: billToParts[2],
                cityStateZip: billToParts[3]
            }
        }
    }

    getBillto() {
        return this.billto;
    }

    getTodaysDate() {
        return this.todaysDate;
    }

    getServices() {
        return this.services;
    }
    //assumes service is an object
    addService(service) {
        this.services.push(service);
    }
    removeService(index) {
        if(index < 0 || index >= this.services.length) return;
        this.services.splice(index, 1);
    }

    getStatus() {
        return this.status;
    }

    getFullInvoice() {
        return {
            
            companyName: this.companyName,
            documentNumber: this.documentNumber,
            billto: JSON.stringify(this.billto),
            shipto: JSON.stringify(this.shipto),
            total: this.total,
            services: this.services, 
            dueDate: this.dueDate,
            memo: this.memo,
            status: this.status
        }
    }
}

export default Invoice;
