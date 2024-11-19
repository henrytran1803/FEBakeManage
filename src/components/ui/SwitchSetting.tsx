import { Label } from "@/components/ui/label";

export const SwitchSetting = ({
                           htmlFor,
                           label,
                           checked,
                           onChange
                       }: {
    htmlFor: string;
    label: string;
    checked: boolean;
    onChange: (checked: boolean) => void;
}) => (
    <div className="flex items-center px-4 py-3 justify-between rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors duration-200">
        <Label htmlFor={htmlFor} className="text-sm font-medium text-gray-700">{label}</Label>
        <div
            role="switch"
            aria-checked={checked}
            onClick={() => onChange(!checked)}
            className={`
                relative inline-flex h-6 w-11 cursor-pointer 
                rounded-full transition-colors duration-200 ease-in-out
                focus-visible:outline-none focus-visible:ring-2 
                focus-visible:ring-blue-500 focus-visible:ring-offset-2
                ${checked ? 'bg-blue-600' : 'bg-gray-200'}
            `}
        >
            <span
                className={`
                    inline-block h-4 w-4 transform rounded-full bg-white 
                    transition duration-200 ease-in-out 
                    shadow-sm translate-y-1
                    ${checked ? 'translate-x-6' : 'translate-x-1'}
                `}
            />
        </div>
    </div>
);