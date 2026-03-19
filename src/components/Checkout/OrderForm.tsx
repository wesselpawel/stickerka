import Link from "next/link";

const inputClass =
  "w-full rounded-xl border border-chill-line bg-white px-3 py-2.5 text-sm text-chill-ink shadow-inner shadow-chill-ink/5 placeholder:text-chill-muted/60 focus:border-chill-sage focus:outline-none focus:ring-2 focus:ring-chill-sage/30";

const labelClass = "mb-1.5 block text-xs font-semibold uppercase tracking-wide text-chill-muted";

export default function OrderForm({
  formErrors,
  customerInfo,
  handleChange,
  setCustomerInfo,
}: {
  formErrors: any;
  customerInfo: any;
  handleChange: any;
  setCustomerInfo: any;
}) {
  return (
    <>
      <form
        onSubmit={(e) => e.preventDefault()}
        className="grid grid-cols-1 gap-8 lg:grid-cols-2"
      >
        <div>
          <h2 className="font-display text-lg font-semibold text-chill-ink">
            Dane do wysyłki
          </h2>
          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="city" className={labelClass}>
                Miasto
                {formErrors?.city && (
                  <span className="ml-2 font-normal normal-case text-red-600">
                    — uzupełnij
                  </span>
                )}
              </label>
              <input
                value={customerInfo.city}
                onChange={(e) => handleChange(e)}
                type="text"
                id="city"
                name="city"
                className={inputClass}
                required
                autoComplete="address-level2"
              />
            </div>
            <div>
              <label htmlFor="postalCode" className={labelClass}>
                Kod pocztowy
                {formErrors?.postalCode && (
                  <span className="ml-2 font-normal normal-case text-red-600">
                    — uzupełnij
                  </span>
                )}
              </label>
              <input
                value={customerInfo.postalCode}
                onChange={(e) => handleChange(e)}
                type="text"
                id="postalCode"
                name="postalCode"
                className={inputClass}
                required
                autoComplete="postal-code"
              />
            </div>
            <div>
              <label htmlFor="street" className={labelClass}>
                Ulica
                {formErrors?.street && (
                  <span className="ml-2 font-normal normal-case text-red-600">
                    — uzupełnij
                  </span>
                )}
              </label>
              <input
                value={customerInfo.street}
                onChange={(e) => handleChange(e)}
                type="text"
                id="street"
                name="street"
                className={inputClass}
                required
                autoComplete="street-address"
              />
            </div>
            <div>
              <label htmlFor="houseNumber" className={labelClass}>
                Numer domu
                {formErrors?.houseNumber && (
                  <span className="ml-2 font-normal normal-case text-red-600">
                    — uzupełnij
                  </span>
                )}
              </label>
              <input
                value={customerInfo.houseNumber}
                onChange={(e) => handleChange(e)}
                type="text"
                id="houseNumber"
                name="houseNumber"
                className={inputClass}
                required
              />
            </div>
          </div>
        </div>

        <div>
          <h2 className="font-display text-lg font-semibold text-chill-ink">
            Dane kontaktowe
          </h2>
          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="firstName" className={labelClass}>
                Imię
                {formErrors?.firstName && (
                  <span className="ml-2 font-normal normal-case text-red-600">
                    — uzupełnij
                  </span>
                )}
              </label>
              <input
                value={customerInfo.firstName}
                onChange={(e) => handleChange(e)}
                type="text"
                id="firstName"
                name="firstName"
                className={inputClass}
                required
                autoComplete="given-name"
              />
            </div>
            <div>
              <label htmlFor="lastName" className={labelClass}>
                Nazwisko
                {formErrors?.lastName && (
                  <span className="ml-2 font-normal normal-case text-red-600">
                    — uzupełnij
                  </span>
                )}
              </label>
              <input
                value={customerInfo.lastName}
                onChange={(e) => handleChange(e)}
                type="text"
                id="lastName"
                name="lastName"
                className={inputClass}
                required
                autoComplete="family-name"
              />
            </div>
            <div className="sm:col-span-2">
              <label htmlFor="phoneNumber" className={labelClass}>
                Telefon
                {formErrors?.phoneNumber && (
                  <span className="ml-2 font-normal normal-case text-red-600">
                    — uzupełnij
                  </span>
                )}
              </label>
              <input
                value={customerInfo.phoneNumber}
                onChange={(e) => handleChange(e)}
                type="tel"
                id="phoneNumber"
                name="phoneNumber"
                className={inputClass}
                required
                autoComplete="tel"
              />
            </div>
          </div>
        </div>
      </form>

      <div className="mt-8 rounded-xl border border-chill-line bg-chill-sand/40 p-4">
        <label className="flex cursor-pointer items-start gap-3">
          <input
            type="checkbox"
            checked={customerInfo.acceptedTerms}
            onChange={() =>
              setCustomerInfo({
                ...customerInfo,
                acceptedTerms: !customerInfo.acceptedTerms,
              })
            }
            className="mt-1 h-4 w-4 shrink-0 rounded border-chill-line text-chill-sage-dark focus:ring-chill-sage"
          />
          <span className="text-sm leading-relaxed text-chill-ink">
            Kupując akceptuję{" "}
            <Link
              target="_blank"
              rel="noopener noreferrer"
              href="https://policies.google.com/terms?hl=pl"
              className="font-semibold text-chill-sage-dark underline decoration-chill-sage underline-offset-2 hover:text-chill-ink"
            >
              regulamin sklepu
            </Link>
            .
            {formErrors?.acceptedTerms && (
              <span className="mt-1 block text-sm font-medium text-red-600">
                Proszę zaakceptować regulamin.
              </span>
            )}
          </span>
        </label>
      </div>
    </>
  );
}
