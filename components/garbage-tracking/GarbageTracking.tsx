"use client";
import { LocateFixed, Route, X } from "lucide-react";
import { useMemo, useState } from "react";
import DescriptionGarbage from "./DescriptionGarbage";
import HeaderSearch from "./HeaderSearch";
type VehicleStatus = "EN_RUTA" | "DETENIDO" | "FUERA_DE_SERVICIO";
import dynamic from "next/dynamic";
export interface Vehicle {
  id: number;
  code: string;
  plate: string;
  driver: string;
  route: string;
  status: VehicleStatus;
  speed: number;
  progress: number;
  position: [number, number];
  routePath: any;
  updatedAt: number;
  color: string;
}

const VEHICLES: Vehicle[] = [
  {
    id: 1,
    code: "CAM-001",
    plate: "EAB-245",
    driver: "Carlos Mendoza",
    route: "Sector 01 · Tambopata",
    status: "EN_RUTA",
    speed: 32,
    progress: 68,
    position: [-12.59773982729466, -69.18656766414644],
    routePath: [
      { lat: -12.59773982729466, lng: -69.18656766414644 },
      { lat: -12.594826382079084, lng: -69.18985873460771 },
      { lat: -12.59409605234812, lng: -69.18918281793596 },
      { lat: -12.594077728636384, lng: -69.1890648007393 },
      { lat: -12.593980874709652, lng: -69.18898165225984 },
      { lat: -12.593878785395928, lng: -69.1889923810959 },
      { lat: -12.592460001495954, lng: -69.1876593232155 },
      { lat: -12.589899888181028, lng: -69.18528556823732 },
      { lat: -12.589842298426106, lng: -69.18543040752412 },
      { lat: -12.590693054853917, lng: -69.18623507022859 },
      { lat: -12.593022804166683, lng: -69.18838351964952 },
      { lat: -12.59379501977483, lng: -69.18911576271059 },
      { lat: -12.59381072583088, lng: -69.18921768665315 },
      { lat: -12.586449715507554, lng: -69.19749766588212 },
      { lat: -12.586261237363516, lng: -69.19750034809114 },
      { lat: -12.584813615892562, lng: -69.19611901044847 },
      { lat: -12.588447051776933, lng: -69.1919267177582 },
      { lat: -12.589114572227473, lng: -69.19118106365205 },
      { lat: -12.590640700693681, lng: -69.18944567441942 },
      { lat: -12.587426134787487, lng: -69.18646037578584 },
    ],
    updatedAt: 8,
    color: "#448d20",
  },

  {
    id: 2,
    code: "CAM-002",
    plate: "EBC-731",
    driver: "Luis Quispe",
    route: "Sector 03 · Tambopata",
    status: "EN_RUTA",
    speed: 24,
    progress: 42,
    position: [-12.602467233986184, -69.18628871440889],
    routePath: [
      { lat: -12.600846942177778, lng: -69.18478667736055 },
      { lat: -12.602977663047914, lng: -69.18676078319551 },
      { lat: -12.603119012454489, lng: -69.187029004097 },
      { lat: -12.601595575853434, lng: -69.18865710496904 },
      { lat: -12.600145423322356, lng: -69.19028520584108 },
      { lat: -12.599420343980146, lng: -69.19110864400865 },
      { lat: -12.598739762226131, lng: -69.19186770915987 },
      { lat: -12.597839297436362, lng: -69.19287621974946 },
      { lat: -12.596339388308559, lng: -69.19454723596574 },
      { lat: -12.59480544075376, lng: -69.19627726078035 },
      { lat: -12.594017522145682, lng: -69.1971328854561 },
      { lat: -12.593234836480482, lng: -69.19642478227617 },
      { lat: -12.592185143928859, lng: -69.1976183652878 },
      { lat: -12.592185143928859, lng: -69.19780611991884 },
      { lat: -12.594077728636384, lng: -69.1978168487549 },
      { lat: -12.594101287694096, lng: -69.19717848300935 },
      { lat: -12.595266149515918, lng: -69.19593125581743 },
      { lat: -12.595991240607097, lng: -69.19664472341539 },
      { lat: -12.596331535358102, lng: -69.19624775648118 },
      { lat: -12.595575033336132, lng: -69.19555574655534 },
      { lat: -12.595967681723003, lng: -69.19509977102281 },
      { lat: -12.596711094355253, lng: -69.19579446315767 },
      { lat: -12.597088035148072, lng: -69.19538408517839 },
      { lat: -12.597224152520392, lng: -69.19536530971529 },
      { lat: -12.597627268929891, lng: -69.1957998275757 },
      { lat: -12.598017296540963, lng: -69.19612705707551 },
      { lat: -12.598399470671545, lng: -69.19633895158769 },
      { lat: -12.59838114726733, lng: -69.19559329748155 },
      { lat: -12.599354903505393, lng: -69.19450163841249 },
      { lat: -12.599464843493429, lng: -69.19445604085924 },
      { lat: -12.59945175540209, lng: -69.1943246126175 },
      { lat: -12.599532901557637, lng: -69.19422805309297 },
      { lat: -12.599708281870585, lng: -69.19424951076509 },
      { lat: -12.600344361700264, lng: -69.19350922107698 },
    ],
    updatedAt: 12,
    color: "#c13f3f",
  },

  {
    id: 3,
    code: "CAM-003",
    plate: "EAC-512",
    driver: "José Flores",
    route: "Sector 05 · Puerto Maldonado",
    status: "EN_RUTA",
    speed: 0,
    progress: 27,
    position: [-12.605987865040687, -69.21212375164033],
    routePath: [
      { lat: -12.605987865040687, lng: -69.21212375164033 },
      { lat: -12.605652818220108, lng: -69.21274334192277 },
      { lat: -12.605346564102401, lng: -69.21335220336915 },
      { lat: -12.605103131081032, lng: -69.21386182308198 },
      { lat: -12.603917373379662, lng: -69.2128747701645 },
      { lat: -12.60344882743331, lng: -69.21349167823793 },
      { lat: -12.602736845360846, lng: -69.21441435813905 },
      { lat: -12.601223876889199, lng: -69.2131617665291 },
      { lat: -12.602409647053864, lng: -69.21167582273485 },
      { lat: -12.603252509044674, lng: -69.21061366796495 },
      { lat: -12.603739378372454, lng: -69.21001821756364 },
      { lat: -12.605265419787644, lng: -69.21147465705873 },
      { lat: -12.605747050182684, lng: -69.21085238456727 },
      { lat: -12.606045451168846, lng: -69.21042859554292 },
      { lat: -12.606540167827502, lng: -69.20976877212526 },
      { lat: -12.60744583711884, lng: -69.21067267656328 },
      { lat: -12.60607162667735, lng: -69.21207278966905 },
    ],
    updatedAt: 25,
    color: "#0c3e73",
  },
];

const GarbageMap = dynamic(() => import("./garbagMap"), {
  ssr: false,
  loading: () => (
    <div className="flex h-full w-full items-center justify-center bg-slate-100">
      <div className="rounded-xl bg-white px-4 py-3 text-sm font-medium text-slate-600 shadow">
        Cargando mapa...
      </div>
    </div>
  ),
});

function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number,
) {
  const R = 6371000;

  const dLat = ((lat2 - lat1) * Math.PI) / 180;

  const dLon = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) ** 2;

  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export default function GarbageTracking() {
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(
    VEHICLES[0],
  );

  const [userLocation, setUserLocation] = useState<[number, number] | null>(
    null,
  );

  const [searchOpen, setSearchOpen] = useState(false);

  const [search, setSearch] = useState("");

  const [showRoutes, setShowRoutes] = useState(true);

  const [sheetExpanded, setSheetExpanded] = useState(false);

  const activeVehicles = VEHICLES.filter(
    (vehicle) => vehicle.status === "EN_RUTA",
  );

  const filteredVehicles = useMemo(() => {
    if (!search.trim()) return VEHICLES;

    const value = search.toLowerCase();

    return VEHICLES.filter(
      (vehicle) =>
        vehicle.code.toLowerCase().includes(value) ||
        vehicle.plate.toLowerCase().includes(value) ||
        vehicle.route.toLowerCase().includes(value),
    );
  }, [search]);

  const distance =
    userLocation && selectedVehicle
      ? calculateDistance(
          userLocation[0],
          userLocation[1],
          selectedVehicle.position[0],
          selectedVehicle.position[1],
        )
      : null;

  const locateUser = () => {
    if (!navigator.geolocation) {
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserLocation([position.coords.latitude, position.coords.longitude]);
      },
      () => {
        alert("No fue posible obtener tu ubicación.");
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
      },
    );
  };

  return (
    <div className="relative h-[100dvh] w-full overflow-hidden">
      {/* MAPA */}
      <GarbageMap
        vehicles={VEHICLES}
        selectedVehicle={selectedVehicle}
        setSelectedVehicle={setSelectedVehicle}
        setSheetExpanded={setSheetExpanded}
        userLocation={userLocation}
        showRoutes={showRoutes}
      />

      {/* HEADER */}
      <HeaderSearch
        setSearchOpen={setSearchOpen}
        searchOpen={searchOpen}
        search={search}
        setSearch={setSearch}
        filteredVehicles={filteredVehicles}
        setSelectedVehicle={setSelectedVehicle}
        setSheetExpanded={setSheetExpanded}
      />

      {/* ESTADO */}
      <div className="absolute left-3 top-[112px] z-[500]">
        <div className="flex items-center gap-2 rounded-full bg-white/95 px-3 py-2 shadow-lg backdrop-blur">
          <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-500" />

          <span className="text-[11px] font-bold text-slate-700">
            {activeVehicles.length} vehículos en ruta
          </span>
        </div>
      </div>

      {/* CONTROLES */}
      <div className="absolute bottom-[280px] right-3 z-[9000] flex flex-col gap-2">
        <button
          onClick={() => setShowRoutes(!showRoutes)}
          className={`
            flex h-12 w-12 items-center justify-center
            rounded-2xl shadow-xl transition active:scale-95
            ${
              showRoutes
                ? "bg-emerald-600 text-white"
                : "bg-white text-slate-700"
            }
          `}
        >
          <Route size={20} />
        </button>

        <button
          onClick={locateUser}
          className="
            flex h-12 w-12 items-center justify-center
            rounded-2xl bg-white text-slate-700
            shadow-xl transition active:scale-95
          "
        >
          <LocateFixed size={20} />
        </button>
      </div>

      {/* INFORMACIÓN DEL VEHÍCULO */}
      <DescriptionGarbage
        selectedVehicle={selectedVehicle}
        setSheetExpanded={setSheetExpanded}
        sheetExpanded={sheetExpanded}
        distance={distance}
        locateUser={locateUser}
      />
    </div>
  );
}
