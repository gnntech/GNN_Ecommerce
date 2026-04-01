# Form Handling in React

## Form Libraries Used

1. **React Hook Form 7.61** - Form state management
2. **Zod 3.25** - Schema validation
3. **@hookform/resolvers** - Integration layer

## Why React Hook Form?

### Advantages
- Minimal re-renders (uncontrolled components)
- Built-in validation
- Easy error handling
- TypeScript support
- Small bundle size (~9KB)

### Comparison with Formik

| Feature | React Hook Form | Formik |
|---------|----------------|--------|
| Bundle Size | 9KB | 13KB |
| Re-renders | Minimal | More |
| Performance | Excellent | Good |
| TypeScript | Native | Plugin |
| Validation | Zod/Yup | Yup |

## Checkout Form Example

### 1. Schema Definition (Zod)

```typescript
// src/pages/Checkout.tsx
import { z } from "zod";

const formSchema = z.object({
    name: z.string()
        .min(2, "Name must be at least 2 characters"),
    
    email: z.string()
        .email("Invalid email address"),
    
    phone: z.string()
        .min(10, "Phone number must be at least 10 digits")
        .regex(/^[0-9]+$/, "Phone must contain only numbers"),
    
    address: z.string()
        .min(10, "Address must be at least 10 characters"),
    
    city: z.string()
        .min(2, "City is required"),
    
    state: z.string()
        .min(2, "State is required"),
    
    pincode: z.string()
        .min(6, "Invalid Pincode")
        .max(6, "Invalid Pincode")
        .regex(/^[0-9]{6}$/, "Pincode must be 6 digits"),
});

type FormValues = z.infer<typeof formSchema>;
```

### 2. Form Setup

```typescript
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

const Checkout = () => {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<FormValues>({
        resolver: zodResolver(formSchema),
    });

    const onSubmit = async (data: FormValues) => {
        // Handle form submission
        console.log(data);
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            {/* Form fields */}
        </form>
    );
};
```

### 3. Input Fields with Validation

```tsx
<div className="space-y-4">
    {/* Name Field */}
    <div>
        <Label htmlFor="name">Full Name</Label>
        <Input
            id="name"
            type="text"
            placeholder="John Doe"
            {...register("name")}
            className={errors.name ? "border-red-500" : ""}
        />
        {errors.name && (
            <p className="text-red-500 text-sm mt-1">
                {errors.name.message}
            </p>
        )}
    </div>

    {/* Email Field */}
    <div>
        <Label htmlFor="email">Email Address</Label>
        <Input
            id="email"
            type="email"
            placeholder="john@example.com"
            {...register("email")}
            className={errors.email ? "border-red-500" : ""}
        />
        {errors.email && (
            <p className="text-red-500 text-sm mt-1">
                {errors.email.message}
            </p>
        )}
    </div>

    {/* Phone Field */}
    <div>
        <Label htmlFor="phone">Phone Number</Label>
        <Input
            id="phone"
            type="tel"
            placeholder="9876543210"
            {...register("phone")}
            className={errors.phone ? "border-red-500" : ""}
        />
        {errors.phone && (
            <p className="text-red-500 text-sm mt-1">
                {errors.phone.message}
            </p>
        )}
    </div>

    {/* Address Field */}
    <div>
        <Label htmlFor="address">Address</Label>
        <Input
            id="address"
            type="text"
            placeholder="123 Main Street"
            {...register("address")}
            className={errors.address ? "border-red-500" : ""}
        />
        {errors.address && (
            <p className="text-red-500 text-sm mt-1">
                {errors.address.message}
            </p>
        )}
    </div>

    {/* City, State, Pincode in Grid */}
    <div className="grid grid-cols-3 gap-4">
        <div>
            <Label htmlFor="city">City</Label>
            <Input
                id="city"
                {...register("city")}
                className={errors.city ? "border-red-500" : ""}
            />
            {errors.city && (
                <p className="text-red-500 text-sm mt-1">
                    {errors.city.message}
                </p>
            )}
        </div>

        <div>
            <Label htmlFor="state">State</Label>
            <Input
                id="state"
                {...register("state")}
                className={errors.state ? "border-red-500" : ""}
            />
            {errors.state && (
                <p className="text-red-500 text-sm mt-1">
                    {errors.state.message}
                </p>
            )}
        </div>

        <div>
            <Label htmlFor="pincode">Pincode</Label>
            <Input
                id="pincode"
                {...register("pincode")}
                className={errors.pincode ? "border-red-500" : ""}
            />
            {errors.pincode && (
                <p className="text-red-500 text-sm mt-1">
                    {errors.pincode.message}
                </p>
            )}
        </div>
    </div>

    {/* Submit Button */}
    <Button
        type="submit"
        className="w-full"
        disabled={loading}
    >
        {loading ? (
            <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
            </>
        ) : (
            "Proceed to Payment"
        )}
    </Button>
</div>
```

## Admin Product Form Example

### 1. Form with File Upload

```typescript
// src/pages/admin/ManageGemstones.tsx
const [formData, setFormData] = useState({
    name: "",
    shortDescription: "",
    meaning: "",
    price: "",
    benefits: [""],
    whoShouldWear: [""],
    careInstructions: [""],
});
const [image, setImage] = useState<File | null>(null);

const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const data = new FormData();
    data.append("name", formData.name);
    data.append("shortDescription", formData.shortDescription);
    data.append("meaning", formData.meaning);
    data.append("price", formData.price);
    data.append("benefits", JSON.stringify(formData.benefits));
    data.append("whoShouldWear", JSON.stringify(formData.whoShouldWear));
    data.append("careInstructions", JSON.stringify(formData.careInstructions));
    
    if (image) {
        data.append("image", image);
    }
    
    try {
        await api.post("/products/gemstones", data, {
            headers: { "Content-Type": "multipart/form-data" }
        });
        toast.success("Gemstone added successfully");
    } catch (error) {
        toast.error("Failed to add gemstone");
    }
};
```

### 2. Dynamic Array Fields

```tsx
{/* Benefits - Dynamic Array */}
<div>
    <Label>Benefits</Label>
    {formData.benefits.map((benefit, index) => (
        <div key={index} className="flex gap-2 mb-2">
            <Input
                value={benefit}
                onChange={(e) => {
                    const newBenefits = [...formData.benefits];
                    newBenefits[index] = e.target.value;
                    setFormData({ ...formData, benefits: newBenefits });
                }}
                placeholder="Enter benefit"
            />
            <Button
                type="button"
                variant="destructive"
                onClick={() => {
                    const newBenefits = formData.benefits.filter((_, i) => i !== index);
                    setFormData({ ...formData, benefits: newBenefits });
                }}
            >
                Remove
            </Button>
        </div>
    ))}
    <Button
        type="button"
        onClick={() => {
            setFormData({
                ...formData,
                benefits: [...formData.benefits, ""]
            });
        }}
    >
        Add Benefit
    </Button>
</div>
```

### 3. File Upload Component

```tsx
// src/components/admin/FileUpload.tsx
interface FileUploadProps {
    onFileSelect: (file: File) => void;
    preview?: string;
}

const FileUpload: React.FC<FileUploadProps> = ({ onFileSelect, preview }) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            onFileSelect(file);
        }
    };

    return (
        <div className="space-y-4">
            <Input
                type="file"
                accept="image/*"
                onChange={handleChange}
            />
            {preview && (
                <img
                    src={preview}
                    alt="Preview"
                    className="w-32 h-32 object-cover rounded"
                />
            )}
        </div>
    );
};
```

## Form Validation Patterns

### 1. Real-time Validation
```typescript
// Validates on blur
<Input
    {...register("email")}
    onBlur={() => trigger("email")}
/>
```

### 2. Conditional Validation
```typescript
const schema = z.object({
    hasDiscount: z.boolean(),
    discountCode: z.string().optional(),
}).refine(
    (data) => {
        if (data.hasDiscount) {
            return data.discountCode && data.discountCode.length > 0;
        }
        return true;
    },
    {
        message: "Discount code is required when discount is enabled",
        path: ["discountCode"],
    }
);
```

### 3. Custom Validation
```typescript
const schema = z.object({
    password: z.string().min(8),
    confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
});
```

## Form State Management

### Loading States
```tsx
const [loading, setLoading] = useState(false);

const onSubmit = async (data: FormValues) => {
    setLoading(true);
    try {
        await api.post("/endpoint", data);
        toast.success("Success!");
    } catch (error) {
        toast.error("Error!");
    } finally {
        setLoading(false);
    }
};
```

### Success/Error Handling
```tsx
import { toast } from "sonner";

// Success
toast.success("Product added successfully!");

// Error
toast.error("Failed to add product");

// Loading
toast.loading("Uploading...");
```

## Best Practices

1. **Use Zod for validation** - Type-safe and composable
2. **Uncontrolled components** - Better performance
3. **Error messages** - Clear and actionable
4. **Loading states** - Disable submit during processing
5. **Reset form** - After successful submission
6. **Accessibility** - Labels, ARIA attributes
7. **Mobile-friendly** - Appropriate input types
