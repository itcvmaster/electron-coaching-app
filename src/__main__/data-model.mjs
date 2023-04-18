import { devWarn } from "@/util/dev.mjs";
import isCyclic from "@/util/is-cyclic.mjs";
import symbolName from "@/util/symbol-name.mjs";

export const Any = symbolName("any");
export const isExempt = symbolName("is-exempt");

export const isRootModel = symbolName("is-root-model");

export const refs = {
  lastValidatedModel: null,
};

function isPrimitiveType(type) {
  return type === String || type === Number || type === Boolean;
}

export function matchType(value, type, key, state = {}) {
  if (value === null) return null;
  switch (type) {
    case String:
      if (typeof value === "string") return value;
      break;
    case Number:
      if (typeof value === "number") return value;
      break;
    case Boolean:
      if (typeof value === "boolean") return value;
      break;
    case Date:
      if (value instanceof Date) return value;
      return new Date(value);
    case Any:
      return value;
    default:
      if (typeof type !== "function")
        throw new TypeError(`Failed to specify a valid type for "${key}".`);
  }

  if (!state.isOptional) {
    if (value === undefined) {
      devWarn(`Missing field "${key}", expected ${type.name}.`);
    } else if (isPrimitiveType(type)) {
      devWarn(
        `Type mismatch on "${key}", expected ${type.name}, got ${typeof value}.`
      );
    }
  }

  return value !== undefined ? type(value) : type();
}

const isValidated = symbolName("is-validated");
export const arbitraryKeys = symbolName("arbitrary-keys");

const optionalSet = new WeakSet();

export { isValidated as __INTERNAL_VALIDATION_SYMBOL };

/**
 * Mark a field as optional. The only purpose here is to suppress warnings.
 */
export function Optional(arg) {
  switch (typeof arg) {
    case "function": {
      const fn = arg.bind(null); // This works similar to typecasting functions.
      optionalSet.add(fn);
      return fn;
    }
    case "object": {
      optionalSet.add(arg);
      return arg;
    }
    default:
      throw new TypeError(`Invalid optional parameter: "${arg}"`);
  }
}

export default function createModel(model) {
  const cycleTrace = isCyclic(model);
  if (cycleTrace) {
    throw new Error(`Cycle detected in model: ${cycleTrace}-> <CYCLE>`);
  }

  function validate(data, currentModel = model, state = {}) {
    if (typeof data !== "object" || !data) {
      data = {};
    }

    if (currentModel === model || currentModel[isRootModel]) {
      refs.lastValidatedModel = currentModel;
    }

    const isOptional = optionalSet.has(currentModel) || data[isExempt];

    for (const key in currentModel) {
      const modelType = currentModel[key];
      const isKeyOptional = optionalSet.has(modelType);
      const currentState = {
        isOptional: state.isOptional || isKeyOptional || isOptional,
      };
      let value = data[key];

      if (Array.isArray(modelType)) {
        if (!Array.isArray(value)) {
          if (!currentState.isOptional) {
            devWarn(`Missing array "${key}".`);
          }
          data[key] = value = [];
        }
        value[isValidated] = true;

        const firstType = modelType[0];

        // nested model
        if (typeof firstType === "object") {
          for (const v of value) {
            validate(v, firstType, currentState);
          }
        }
        // primitive
        else {
          for (let i = 0; i < value.length; i++) {
            value[i] = matchType(value[i], firstType, key, currentState);
          }
        }
      } else if (typeof modelType === "object") {
        if (!value) {
          if (!currentState.isOptional) {
            devWarn(`Missing object "${key}".`);
          }
          data[key] = value = {};
        }
        value[isValidated] = true;

        if (modelType[arbitraryKeys]) {
          for (const subKey in value) {
            validate(value[subKey], modelType[arbitraryKeys], currentState);
          }
        } else validate(value, modelType, currentState);
      } else {
        data[key] = matchType(value, modelType, key, currentState);
      }
    }

    data[isValidated] = true;

    return data;
  }

  return validate;
}

const NUMERIC_REGEXP = /^[0-9]+$/;

const getWithModel = (model) => (target, key) => {
  const isKeySymbol = typeof key === "symbol";
  if (!isKeySymbol && Array.isArray(model) && NUMERIC_REGEXP.test(key)) {
    return typeof model[0] === "object"
      ? new Proxy(target[key], { get: getWithModel(model[0]) })
      : target[key];
  }

  const modelArbitraryKeys = model[arbitraryKeys];

  if (
    !isKeySymbol &&
    !model[key] &&
    !modelArbitraryKeys &&
    !(key in Object.getPrototypeOf(target)) &&
    // `then` is special-cased because the Promise specification allows
    // the `then` property to be read.
    key !== "then" &&
    !NUMERIC_REGEXP.test(key)
  ) {
    devWarn(
      `Data model does not contain field "${key}". Please update the model.`,
      model
    );
  }

  const valueType = model[key] ?? modelArbitraryKeys;
  if (typeof valueType === "object" && target[key]) {
    return new Proxy(target[key], { get: getWithModel(valueType) });
  }

  return target[key];
};

export function withAccessValidation(data, model) {
  if (!model) {
    return data;
  }

  return new Proxy(data, {
    get: getWithModel(model),
  });
}
