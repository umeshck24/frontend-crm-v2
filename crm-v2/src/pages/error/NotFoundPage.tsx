import { ButtonLink } from "@/components/ui/button/button";

export const NotFoundPage = () => {
  return (
    <div className="flex flex-col items-center justify-center">
      <img
        src={`${import.meta.env.BASE_URL}images/connection_lost.svg`}
        alt="error"
        className="mt-32 mb-4 block max-h-[300px] max-w-[300px]"
      />
      <div>
        <h2 className="text-center text-2xl font-bold">Seite nicht gefunden</h2>
        <p className="mb-6 text-center text-base text-gray-600">
          Die Seite, die Sie suchen, existiert nicht oder wurde verschoben.
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
