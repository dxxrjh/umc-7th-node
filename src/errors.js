export class DuplicateUserEmailError extends Error {
    errorCode = "U001";

    constructor(reason, data){
        super(reason);
        this.reason = reason;
        this.data = data;
    }
}

export class NonExistingShopError extends Error {
    errorCode = "U002";

    constructor(reason, data){
        super(reason);
        this.reason = reason;
        this.data = data;
    }
}

export class AlreadyAddedMissionError extends Error {
    errorCode = "U003";

    constructor(reason, data){
        super(reason);
        this.reason = reason;
        this.data = data;
    }
}