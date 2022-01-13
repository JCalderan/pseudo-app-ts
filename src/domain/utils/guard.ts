class Validator<T> {
    private readonly predicate: (value: T) => boolean;
    private readonly msg: string;

    constructor(predicate: (value: T) => boolean, msg: string) {
        this.predicate = predicate;
        this.msg = msg;
    }

    public validate(value: T): boolean {
        return this.predicate(value);
    }
    
    public getMessage(): string {
        return this.msg;
    }
}

class GuardedValue<T> {
    private readonly value: T;
    private readonly success: boolean;
    private readonly reason: string;

    private constructor(value: T, success: boolean, reason: string) {
        this.value = value;
        this.success = success;
        this.reason = reason;
    }

    public static validated<V>(value: V) : GuardedValue<V> {
        return new GuardedValue<V>(value, true, null);
    }

    public static failed<V>(value: V, reason: string) : GuardedValue<V> {
        return new GuardedValue<V>(value, false, reason);
    }

    public succeeded(): boolean {
        return this.success;
    }

    public getValue(): T {
        return this.value;
    }

    public getReason(): string {
        return this.reason;
    }
}

class Guard<T> {
    private readonly value: T;
    private validators: Array<Validator<T>>;

    constructor(value: T) {
        this.value = value;
        this.validators = [];
    }

    public verifyThat(validator: Validator<T>): Guard<T> {
        this.validators.push(validator);
        return this;
    }

    public validate(): GuardedValue<T> {
        const failedValidator = this.validators
            // le "!" est très important, peut être vaudrait il mieux changer l'api ici (ie: .failed())
            .find((validator: Validator<T>) => !validator.validate(this.value));
        
        return failedValidator !== undefined ? 
            GuardedValue.failed(this.value, failedValidator.getMessage()) :
            GuardedValue.validated(this.value);
    }

    public getValue(): T {
        return this.value;
    }
}

export {
    Validator,
    GuardedValue, 
    Guard
}