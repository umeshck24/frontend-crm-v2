import { ButtonLink } from "@/components/ui/button/button";

export const ErrorPage = () => {
  return (
    <div className="flex flex-col items-center justify-center">
      <img
        src={`${import.meta.env.BASE_URL}images/connection_lost.svg`}
        alt="error"
        className="mt-32 mb-4 block max-h-75 max-w-75"
      />
      <div>
        <h2 className="text-center text-2xl font-bold">Ups, es ist etwas schiefgelaufen!</h2>
        <p className="mb-6 text-center text-base text-gray-600">
          Wir bitten vielmals um Entschuldigung!
        </p>
        <div className="flex justify-center">
          <ButtonLink variant="buttonLink" to={window.location.origin}>
            Zur Startseite
          </ButtonLink>
        </div>
      </div>
    </div>
  );
};
