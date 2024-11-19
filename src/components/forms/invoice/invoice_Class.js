class Invoice {
    constructor() {
        this.companyName = '';
        this.documentNumber = '';
        this.billto = {};
        this.shipto = {};
        this.total = null;
        this.items = []; // array of objects
        this.shipDate = null;
        this.memo = '';
    }

    setShipDate(date) {
        this.shipDate = date;
    }

    setMemo(memo) {
        this.memo = memo;
    }

    setTotal(total) {    
        this.total = total;
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

    setShipto(shipto) {
        let shipToParts = shipto.split('\n');
        let length = shipToParts.length;
        if(length == 3) {
            this.shipto = {
                name: shipToParts[0],
                addr1: shipToParts[1],
                cityStateZip: shipToParts[2]
            }
        }
        else if(length == 4) {
            this.shipto = {
                name: shipToParts[0],
                addr1: shipToParts[1],
                addr2: shipToParts[2],
                cityStateZip: shipToParts[3]
            }
        }
    }

    getBillto() {
        return this.billto;
    }
    getItems() {
        return this.items;
    }
    //assumes item is an object
    addItem(item) {
        this.items.push(item);
    }
    removeItem(index) {
        if(index < 0 || index >= this.items.length) return;
        this.items.splice(index, 1);
    }

    getFullInvoice() {
        return {
            
            companyName: this.companyName,
            documentNumber: this.documentNumber,
            billto: JSON.stringify(this.billto),
            shipto: JSON.stringify(this.shipto),
            total: this.total,
            items: this.items, 
            shipDate: this.shipDate,
            memo: this.memo
        }
    }
}

export default Invoice;
