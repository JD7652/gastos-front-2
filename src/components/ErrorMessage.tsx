import { type PropsWithChildren } from "react"
//Igual, se agrega "type" para que no marque error, antes lo hicimos
//poniendo "type" a fuera de los corchetes, ahora lo hacemos dentro
export default function ErrorMessage({ children }: PropsWithChildren) {
    return (
        <p className="bg-red-600 p-2 text-white font-bold text-sm text-center">
            {children}
        </p>
    )
}