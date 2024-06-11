class SalesOrder {
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

    addItem(item) {
        this.items.push(item);
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

    getBillto() {
        return this.billto;
    }

    getFullSalesOrder() {
        return {
            companyName: this.companyName,
            documentNumber: this.documentNumber,
            billto: JSON.stringify(this.billto),
            shipto: JSON.stringify(this.shipto),
            total: this.total,
            items: this.items, //TODO: convert to JSON
            shipDate: this.shipDate,
            memo: this.memo
        }
    }

}
return SalesOrder