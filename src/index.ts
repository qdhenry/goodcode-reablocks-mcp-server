import { McpAgent } from "agents/mcp";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";

// Simplified but enhanced component metadata
interface ComponentSchema {
	name: string;
	category: string;
	description: string;
	props: PropDefinition[];
	variants: string[];
	examples: CodeExample[];
	useCases: string[];
	relatedComponents: string[];
}

interface PropDefinition {
	name: string;
	type: string;
	required: boolean;
	description: string;
	defaultValue?: any;
}

interface CodeExample {
	title: string;
	code: string;
	description: string;
}

interface GenerationRequest {
	type: 'dashboard' | 'form' | 'table' | 'navigation' | 'custom';
	description: string;
	requirements: string[];
	styling?: {
		theme?: 'light' | 'dark' | 'auto';
		spacing?: 'compact' | 'normal' | 'spacious';
		colorScheme?: string;
	};
}

// Natural Language Processing for component requirements
class ComponentNLP {
	private intentPatterns = {
		dashboard: /dashboard|overview|summary|metrics|analytics|admin/i,
		table: /table|list|grid|data|rows|columns|display.*data/i,
		form: /form|input|submit|validate|fields|contact|login|register/i,
		navigation: /nav|menu|sidebar|header|navigation|breadcrumb/i,
		layout: /layout|structure|arrange|organize|card|container/i,
		interactive: /button|click|action|interactive|toggle|select/i,
		data: /data|information|content|text|display/i
	};

	private componentKeywords = {
		'Button': ['button', 'click', 'action', 'submit', 'cancel'],
		'Input': ['input', 'field', 'text', 'email', 'password', 'form'],
		'Card': ['card', 'container', 'panel', 'section', 'content'],
		'Dialog': ['dialog', 'modal', 'popup', 'overlay', 'alert'],
		'Table': ['table', 'list', 'grid', 'data', 'rows'],
		'Menu': ['menu', 'navigation', 'nav', 'sidebar'],
		'Tabs': ['tabs', 'tabbed', 'sections', 'pages'],
		'Select': ['select', 'dropdown', 'choose', 'options'],
		'Checkbox': ['checkbox', 'check', 'multi-select', 'toggle'],
		'Badge': ['badge', 'label', 'tag', 'status'],
		'Avatar': ['avatar', 'profile', 'user', 'image'],
		'Notification': ['notification', 'alert', 'message', 'toast'],
		'Breadcrumbs': ['breadcrumb', 'navigation', 'path', 'trail']
	};

	parseRequest(description: string): GenerationRequest {
		const requirements: string[] = [];
		let type: GenerationRequest['type'] = 'custom';

		// Detect intent
		for (const [intent, pattern] of Object.entries(this.intentPatterns)) {
			if (pattern.test(description)) {
				requirements.push(intent);
				if (intent === 'dashboard') type = 'dashboard';
				else if (intent === 'table') type = 'table';
				else if (intent === 'form') type = 'form';
				else if (intent === 'navigation') type = 'navigation';
			}
		}

		return { type, description, requirements };
	}

	suggestComponents(description: string): string[] {
		const suggested = new Set<string>();
		const descLower = description.toLowerCase();

		for (const [component, keywords] of Object.entries(this.componentKeywords)) {
			if (keywords.some(keyword => descLower.includes(keyword))) {
				suggested.add(component);
			}
		}

		return Array.from(suggested);
	}
}

// Enhanced component database with real Reablocks components
const ENHANCED_REABLOCKS_COMPONENTS: Record<string, ComponentSchema> = {
	Button: {
		name: 'Button',
		category: 'Elements',
		description: 'A fundamental UI element designed for interactions, offering a variety of styles, sizes, and colors to accommodate different use cases within an application.',
		props: [
			{ name: 'variant', type: '"filled" | "outline" | "text"', required: false, description: 'The visual style variant of the button', defaultValue: 'filled' },
			{ name: 'size', type: '"small" | "medium" | "large"', required: false, description: 'The size of the button', defaultValue: 'medium' },
			{ name: 'color', type: '"default" | "primary" | "secondary" | "success" | "warning" | "error"', required: false, description: 'The color theme of the button', defaultValue: 'default' },
			{ name: 'disabled', type: 'boolean', required: false, description: 'Whether the button is disabled', defaultValue: false },
			{ name: 'fullWidth', type: 'boolean', required: false, description: 'Whether the button should take the full width of its container', defaultValue: false },
			{ name: 'onClick', type: '(event: MouseEvent) => void', required: false, description: 'Handler function called when the button is clicked' },
			{ name: 'children', type: 'ReactNode', required: true, description: 'The content to display inside the button' }
		],
		variants: ['filled', 'outline', 'text'],
		examples: [
			{ title: 'Basic Button', code: '<Button>Click Me</Button>', description: 'A simple button with default styling' },
			{ title: 'Primary Action', code: '<Button variant="filled" color="primary">Save Changes</Button>', description: 'A prominent button for primary actions' },
			{ title: 'Secondary Action', code: '<Button variant="outline" color="secondary">Cancel</Button>', description: 'A less prominent button for secondary actions' }
		],
		useCases: ['Primary actions', 'Form submissions', 'Navigation triggers', 'Modal actions'],
		relatedComponents: ['IconButton', 'ButtonGroup']
	},

	Input: {
		name: 'Input',
		category: 'Form',
		description: 'A fundamental element in form design, allowing users to enter data. Its versatility supports a variety of applications, from simple text entries to complex data inputs.',
		props: [
			{ name: 'type', type: 'string', required: false, description: 'The type of input (text, email, password, etc.)', defaultValue: 'text' },
			{ name: 'placeholder', type: 'string', required: false, description: 'Placeholder text to display when input is empty' },
			{ name: 'value', type: 'string', required: false, description: 'The controlled value of the input' },
			{ name: 'onChange', type: '(value: string) => void', required: false, description: 'Handler called when input value changes' },
			{ name: 'disabled', type: 'boolean', required: false, description: 'Whether the input is disabled', defaultValue: false },
			{ name: 'error', type: 'string', required: false, description: 'Error message to display' },
			{ name: 'size', type: '"small" | "medium" | "large"', required: false, description: 'The size of the input', defaultValue: 'medium' },
			{ name: 'fullWidth', type: 'boolean', required: false, description: 'Whether input takes full width', defaultValue: false }
		],
		variants: ['default', 'error', 'disabled'],
		examples: [
			{ title: 'Basic Input', code: '<Input placeholder="Enter text" />', description: 'A simple text input field' },
			{ title: 'Email Input', code: '<Input type="email" placeholder="Enter email" />', description: 'Input specifically for email addresses' },
			{ title: 'Input with Error', code: '<Input placeholder="Email" error="Invalid email format" />', description: 'Input field with error state' }
		],
		useCases: ['Text entry', 'Form fields', 'Search boxes', 'Data input'],
		relatedComponents: ['Textarea', 'Select', 'DebouncedInput']
	},

	Card: {
		name: 'Card',
		category: 'Layout',
		description: 'Cards are a fundamental building block for compositions, such as forms, or sections. They provide a consistent container for content with optional padding and styling.',
		props: [
			{ name: 'children', type: 'ReactNode', required: true, description: 'The content to display inside the card' },
			{ name: 'className', type: 'string', required: false, description: 'Additional CSS classes to apply' },
			{ name: 'disablePadding', type: 'boolean', required: false, description: 'Whether to disable default padding', defaultValue: false }
		],
		variants: ['default', 'elevated', 'outlined'],
		examples: [
			{ title: 'Basic Card', code: '<Card><h3>Card Title</h3><p>Card content goes here.</p></Card>', description: 'A simple card with content' },
			{ title: 'Card without Padding', code: '<Card disablePadding><img src="image.jpg" alt="Full width image" /></Card>', description: 'Card that allows content to fill the entire space' }
		],
		useCases: ['Content containers', 'Information panels', 'Dashboard widgets', 'Form sections'],
		relatedComponents: ['Block', 'Stack', 'Divider']
	},

	Dialog: {
		name: 'Dialog',
		category: 'Layers',
		description: 'The Dialog component serves as a pop-up or modal window that overlays the main content, allowing the display of important messages, forms, or user interactions while grabbing user\'s focus.',
		props: [
			{ name: 'open', type: 'boolean', required: true, description: 'Whether the dialog is open' },
			{ name: 'onClose', type: '() => void', required: true, description: 'Function called when dialog should close' },
			{ name: 'title', type: 'string', required: false, description: 'The title of the dialog' },
			{ name: 'children', type: 'ReactNode', required: true, description: 'The content to display inside the dialog' },
			{ name: 'size', type: '"small" | "medium" | "large"', required: false, description: 'The size of the dialog', defaultValue: 'medium' }
		],
		variants: ['default', 'fullscreen'],
		examples: [
			{ title: 'Basic Dialog', code: '<Dialog open={isOpen} onClose={() => setIsOpen(false)} title="Confirm Action"><p>Are you sure?</p></Dialog>', description: 'A simple confirmation dialog' },
			{ title: 'Form Dialog', code: '<Dialog open={isOpen} onClose={handleClose} title="Edit Profile"><form>...</form></Dialog>', description: 'Dialog containing a form' }
		],
		useCases: ['Confirmations', 'Forms', 'Detailed views', 'Alerts'],
		relatedComponents: ['Drawer', 'ConfirmDialog', 'Notification']
	},

	Stack: {
		name: 'Stack',
		category: 'Layout',
		description: 'Component that sets component spacing. It can be used to add space between components such as a menu or form elements.',
		props: [
			{ name: 'direction', type: '"row" | "column" | "rowReverse" | "columnReverse"', required: false, description: 'The direction of the stack', defaultValue: 'column' },
			{ name: 'spacing', type: '"xs" | "sm" | "md" | "lg" | "xl"', required: false, description: 'The spacing between items', defaultValue: 'md' },
			{ name: 'alignItems', type: '"start" | "end" | "center" | "stretch"', required: false, description: 'How items are aligned', defaultValue: 'stretch' },
			{ name: 'justifyContent', type: '"start" | "end" | "center" | "spaceBetween"', required: false, description: 'How items are justified', defaultValue: 'start' },
			{ name: 'children', type: 'ReactNode', required: true, description: 'The items to stack' }
		],
		variants: ['row', 'column', 'dense', 'inline'],
		examples: [
			{ title: 'Vertical Stack', code: '<Stack><Button>First</Button><Button>Second</Button></Stack>', description: 'Stack items vertically with default spacing' },
			{ title: 'Horizontal Stack', code: '<Stack direction="row" spacing="lg"><Button>Cancel</Button><Button>Save</Button></Stack>', description: 'Stack items horizontally with large spacing' }
		],
		useCases: ['Form layouts', 'Button groups', 'Content sections', 'Navigation items'],
		relatedComponents: ['Divider', 'Card', 'Block']
	},

	Select: {
		name: 'Select',
		category: 'Form',
		description: 'The Select component enhances user interaction by allowing the selection of a value or multiple values from a list of options with support for filtering, creation, and async loading.',
		props: [
			{ name: 'options', type: 'SelectOption[]', required: true, description: 'Array of options to select from' },
			{ name: 'value', type: 'any', required: false, description: 'The selected value(s)' },
			{ name: 'onChange', type: '(value: any) => void', required: false, description: 'Handler called when selection changes' },
			{ name: 'placeholder', type: 'string', required: false, description: 'Placeholder text when no selection' },
			{ name: 'multiple', type: 'boolean', required: false, description: 'Allow multiple selections', defaultValue: false },
			{ name: 'searchable', type: 'boolean', required: false, description: 'Enable search/filtering', defaultValue: true },
			{ name: 'createable', type: 'boolean', required: false, description: 'Allow creating new options', defaultValue: false },
			{ name: 'disabled', type: 'boolean', required: false, description: 'Whether the select is disabled', defaultValue: false }
		],
		variants: ['single', 'multiple', 'searchable', 'createable'],
		examples: [
			{ title: 'Basic Select', code: '<Select options={[{label: "Option 1", value: "1"}]} placeholder="Choose..." />', description: 'Simple single selection' },
			{ title: 'Multi-Select', code: '<Select multiple options={options} placeholder="Select multiple..." />', description: 'Multiple selection with chips' }
		],
		useCases: ['Option selection', 'Filtering', 'Multi-choice inputs', 'Searchable dropdowns'],
		relatedComponents: ['Input', 'Checkbox', 'Radio', 'Menu']
	},

	DataSize: {
		name: 'DataSize',
		category: 'Data',
		description: 'The Data Size component is designed to display data sizes in a human-readable format using the human-format library, converting bytes into understandable formats like MB, GB, etc.',
		props: [
			{ name: 'value', type: 'number | string | null | undefined', required: true, description: 'The byte value to format' },
			{ name: 'placeholder', type: 'string', required: false, description: 'Text to show when value is null/undefined', defaultValue: '--' }
		],
		variants: ['default'],
		examples: [
			{ title: 'File Size', code: '<DataSize value={1048576} />', description: 'Displays "1 MB"' },
			{ title: 'Large File', code: '<DataSize value={324344535345232482} />', description: 'Displays in appropriate unit (TB, PB, etc.)' }
		],
		useCases: ['File sizes', 'Data usage', 'Storage displays', 'Download sizes'],
		relatedComponents: ['Duration', 'DateFormat', 'Pluralize']
	},

	Notification: {
		name: 'Notification',
		category: 'Layers',
		description: 'The Notification component delivers real-time messages or alerts to users, providing important updates, feedback, or information within an application.',
		props: [
			{ name: 'title', type: 'string', required: false, description: 'The notification title' },
			{ name: 'body', type: 'string | ReactNode', required: false, description: 'The notification content' },
			{ name: 'variant', type: '"default" | "success" | "warning" | "error" | "info"', required: false, description: 'The notification type', defaultValue: 'default' },
			{ name: 'timeout', type: 'number', required: false, description: 'Auto-dismiss timeout in ms', defaultValue: 5000 },
			{ name: 'showClose', type: 'boolean', required: false, description: 'Show close button', defaultValue: true }
		],
		variants: ['default', 'success', 'warning', 'error', 'info'],
		examples: [
			{ title: 'Success Message', code: 'notify("Changes saved successfully!", { variant: "success" })', description: 'Show success notification' },
			{ title: 'Error Alert', code: 'notify("Something went wrong", { variant: "error", timeout: 0 })', description: 'Show persistent error' }
		],
		useCases: ['Status updates', 'Error messages', 'Success confirmations', 'Information alerts'],
		relatedComponents: ['Dialog', 'Toast', 'Alert']
	}
};

// Intelligent code generator
class SmartCodeGenerator {
	private nlp: ComponentNLP;

	constructor() {
		this.nlp = new ComponentNLP();
	}

	generateDashboard(request: GenerationRequest): string {
		const components = this.selectComponents(request);
		const layout = this.determineLayout(request);

		return this.composeDashboard(components, layout, request);
	}

	private selectComponents(request: GenerationRequest): ComponentSchema[] {
		const suggested = this.nlp.suggestComponents(request.description);

		// Add essential dashboard components
		const essentialComponents = ['Card', 'Button', 'Stack'];
		const allComponents = [...new Set([...suggested, ...essentialComponents])];

		return allComponents
			.map(name => ENHANCED_REABLOCKS_COMPONENTS[name])
			.filter(Boolean);
	}

	private determineLayout(request: GenerationRequest): 'grid' | 'stack' | 'flex' {
		if (request.description.includes('grid') || request.type === 'dashboard') return 'grid';
		if (request.description.includes('vertical') || request.description.includes('stack')) return 'stack';
		return 'flex';
	}

	private composeDashboard(components: ComponentSchema[], layout: string, request: GenerationRequest): string {
		const imports = this.generateImports(components);
		const componentCode = this.generateDashboardComponent(components, layout, request);

		return `${imports}

${componentCode}`;
	}

	private generateImports(components: ComponentSchema[]): string {
		const componentNames = components.map(c => c.name);
		return `import React, { useState, useEffect } from 'react';
import { ${componentNames.join(', ')} } from 'reablocks';`;
	}

	private generateDashboardComponent(components: ComponentSchema[], layout: string, request: GenerationRequest): string {
		const hasForm = request.requirements.includes('form');
		const hasTable = request.requirements.includes('table');
		const hasDashboard = request.requirements.includes('dashboard');

		if (hasForm) {
			return this.generateFormLayout(components);
		} else if (hasTable) {
			return this.generateTableLayout(components);
		} else if (hasDashboard) {
			return this.generateDashboardLayout(components);
		} else {
			return this.generateGenericLayout(components, layout);
		}
	}

	private generateFormLayout(components: ComponentSchema[]): string {
		return `interface FormData {
  name: string;
  email: string;
  message: string;
}

export const GeneratedForm: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Add your form submission logic here
      console.log('Form submitted:', formData);
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      alert('Form submitted successfully!');
    } catch (error) {
      console.error('Submission failed:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (field: keyof FormData) => (value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Card className="max-w-md mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">Contact Form</h2>
      <form onSubmit={handleSubmit}>
        <Stack spacing="lg">
          <Input
            placeholder="Your Name"
            value={formData.name}
            onChange={handleChange('name')}
            fullWidth
          />
          <Input
            type="email"
            placeholder="Email Address"
            value={formData.email}
            onChange={handleChange('email')}
            fullWidth
          />
          <Input
            placeholder="Message"
            value={formData.message}
            onChange={handleChange('message')}
            fullWidth
          />
          <Stack direction="row" spacing="md" justifyContent="end">
            <Button 
              variant="outline" 
              disabled={isSubmitting}
              onClick={() => setFormData({ name: '', email: '', message: '' })}
            >
              Clear
            </Button>
            <Button 
              type="submit" 
              color="primary"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Submitting...' : 'Submit'}
            </Button>
          </Stack>
        </Stack>
      </form>
    </Card>
  );
};`;
	}

	private generateDashboardLayout(components: ComponentSchema[]): string {
		return `interface DashboardProps {
  data?: any[];
  loading?: boolean;
  onRefresh?: () => void;
}

export const GeneratedDashboard: React.FC<DashboardProps> = ({
  data = [],
  loading = false,
  onRefresh
}) => {
  const [selectedMetric, setSelectedMetric] = useState<string>('users');

  const metrics = [
    { id: 'users', label: 'Total Users', value: '12,345', change: '+12%', color: 'primary' },
    { id: 'revenue', label: 'Revenue', value: '$67,890', change: '+8%', color: 'success' },
    { id: 'orders', label: 'Orders', value: '1,234', change: '-3%', color: 'warning' }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div>Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <Button variant="outline" onClick={onRefresh}>
            Refresh Data
          </Button>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {metrics.map((metric) => (
            <Card key={metric.id} className="cursor-pointer hover:shadow-lg transition-shadow">
              <div className="p-6">
                <h3 className="text-sm font-medium text-gray-500 mb-2">{metric.label}</h3>
                <div className="flex items-baseline justify-between">
                  <p className="text-3xl font-bold text-gray-900">{metric.value}</p>
                  <span className={\`text-sm font-medium \${
                    metric.change.startsWith('+') ? 'text-green-600' : 'text-red-600'
                  }\`}>
                    {metric.change}
                  </span>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Chart Area */}
          <Card className="lg:col-span-2">
            <div className="p-6">
              <h3 className="text-lg font-semibold mb-4">Analytics Overview</h3>
              <div className="h-64 flex items-center justify-center bg-gray-100 rounded">
                <p className="text-gray-500">Chart component would go here</p>
              </div>
            </div>
          </Card>

          {/* Side Panel */}
          <Card>
            <div className="p-6">
              <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
              <Stack spacing="md">
                <Button fullWidth color="primary">
                  Create New
                </Button>
                <Button fullWidth variant="outline">
                  View Reports
                </Button>
                <Button fullWidth variant="outline">
                  Settings
                </Button>
              </Stack>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};`;
	}

	private generateTableLayout(components: ComponentSchema[]): string {
		return `interface TableItem {
  id: string;
  name: string;
  status: 'active' | 'inactive' | 'pending';
  date: string;
  value: number;
}

export const GeneratedTable: React.FC = () => {
  const [items, setItems] = useState<TableItem[]>([
    { id: '1', name: 'Item 1', status: 'active', date: '2024-01-15', value: 1250 },
    { id: '2', name: 'Item 2', status: 'pending', date: '2024-01-14', value: 890 },
    { id: '3', name: 'Item 3', status: 'inactive', date: '2024-01-13', value: 2100 }
  ]);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredItems = items.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelectAll = () => {
    if (selectedItems.length === filteredItems.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(filteredItems.map(item => item.id));
    }
  };

  const handleSelectItem = (id: string) => {
    setSelectedItems(prev =>
      prev.includes(id)
        ? prev.filter(itemId => itemId !== id)
        : [...prev, id]
    );
  };

  const getStatusColor = (status: TableItem['status']) => {
    switch (status) {
      case 'active': return 'success';
      case 'pending': return 'warning';
      case 'inactive': return 'error';
      default: return 'default';
    }
  };

  return (
    <div className="p-6">
      <Card>
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Data Table</h2>
            <Stack direction="row" spacing="md">
              <Input
                placeholder="Search items..."
                value={searchTerm}
                onChange={setSearchTerm}
              />
              <Button color="primary">Add New</Button>
            </Stack>
          </div>

          {/* Bulk Actions */}
          {selectedItems.length > 0 && (
            <div className="mb-4 p-3 bg-blue-50 rounded-lg">
              <Stack direction="row" spacing="md" alignItems="center">
                <span className="text-sm text-blue-700">
                  {selectedItems.length} item(s) selected
                </span>
                <Button size="small" variant="outline">
                  Delete Selected
                </Button>
                <Button size="small" variant="outline">
                  Export Selected
                </Button>
              </Stack>
            </div>
          )}

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-2">
                    <input
                      type="checkbox"
                      checked={selectedItems.length === filteredItems.length}
                      onChange={handleSelectAll}
                    />
                  </th>
                  <th className="text-left py-3 px-4">Name</th>
                  <th className="text-left py-3 px-4">Status</th>
                  <th className="text-left py-3 px-4">Date</th>
                  <th className="text-left py-3 px-4">Value</th>
                  <th className="text-left py-3 px-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredItems.map((item) => (
                  <tr key={item.id} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-2">
                      <input
                        type="checkbox"
                        checked={selectedItems.includes(item.id)}
                        onChange={() => handleSelectItem(item.id)}
                      />
                    </td>
                    <td className="py-3 px-4 font-medium">{item.name}</td>
                    <td className="py-3 px-4">
                      <span className={\`px-2 py-1 rounded-full text-xs font-medium \${
                        item.status === 'active' ? 'bg-green-100 text-green-800' :
                        item.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }\`}>
                        {item.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-gray-600">{item.date}</td>
                    <td className="py-3 px-4">
                      <DataSize value={item.value * 1024} />
                    </td>
                    <td className="py-3 px-4">
                      <Stack direction="row" spacing="sm">
                        <Button size="small" variant="text">Edit</Button>
                        <Button size="small" variant="text" color="error">Delete</Button>
                      </Stack>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredItems.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No items found matching your search.
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};`;
	}

	private generateGenericLayout(components: ComponentSchema[], layout: string): string {
		const componentList = components.map(c => c.name).join(', ');

		return `export const GeneratedComponent: React.FC = () => {
  const [state, setState] = useState({});

  return (
    <div className="p-6">
      <Card>
        <div className="p-6">
          <h2 className="text-2xl font-bold mb-6">Generated Component</h2>
          <Stack spacing="lg">
            {/* Components: ${componentList} */}
            <div className="space-y-4">
              <p className="text-gray-600">
                This component was generated based on your requirements.
                It includes the following Reablocks components: ${componentList}
              </p>
              
              <Stack direction="row" spacing="md">
                <Button color="primary">Primary Action</Button>
                <Button variant="outline">Secondary Action</Button>
              </Stack>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <div className="p-4">
                    <h3 className="font-semibold mb-2">Section 1</h3>
                    <p className="text-sm text-gray-600">Content goes here</p>
                  </div>
                </Card>
                <Card>
                  <div className="p-4">
                    <h3 className="font-semibold mb-2">Section 2</h3>
                    <p className="text-sm text-gray-600">More content here</p>
                  </div>
                </Card>
              </div>
            </div>
          </Stack>
        </div>
      </Card>
    </div>
  );
};`;
	}
}

// Main MCP Server Class
export class MyMCP extends McpAgent {
	private codeGenerator: SmartCodeGenerator;
	private nlp: ComponentNLP;

	server = new McpServer({
		name: "Enhanced Reablocks MCP Server",
		version: "1.0.0",
	});

	constructor(ctx: DurableObjectState, env: any) {
		super(ctx, env);
		this.codeGenerator = new SmartCodeGenerator();
		this.nlp = new ComponentNLP();
	}

	async init() {
		// Tool 1: Intelligent Dashboard Generation
		this.server.tool(
			"generate_intelligent_dashboard",
			{
				description: z.string().describe("Natural language description of what you want to build"),
				requirements: z.array(z.string()).optional().describe("Specific requirements"),
				styling: z.object({
					theme: z.enum(['light', 'dark', 'auto']).optional(),
					spacing: z.enum(['compact', 'normal', 'spacious']).optional(),
					colorScheme: z.string().optional()
				}).optional()
			},
			async ({ description, requirements = [], styling }) => {
				try {
					const request: GenerationRequest = {
						type: 'dashboard',
						description,
						requirements,
						styling
					};

					const generatedCode = this.codeGenerator.generateDashboard(request);
					const suggestedComponents = this.nlp.suggestComponents(description);

					return {
						content: [{
							type: "text",
							text: `# Generated Dashboard Component

## Description
${description}

## Detected Components
${suggestedComponents.join(', ')}

## Generated Code

\`\`\`tsx
${generatedCode}
\`\`\`

## Usage Instructions

1. **Install reablocks**: \`npm install reablocks\`
2. **Copy the generated code** into your React project
3. **Import and use** the component: \`<GeneratedDashboard />\`
4. **Customize** the styling and data as needed

## Features Included
- ✅ Responsive design
- ✅ TypeScript support
- ✅ Error handling
- ✅ Loading states
- ✅ Interactive components
- ✅ Modern styling with Tailwind CSS

## Next Steps
- Connect your data source
- Customize colors and spacing
- Add additional functionality as needed`
						}]
					};
				} catch (error) {
					return {
						content: [{
							type: "text",
							text: `Error: ${error instanceof Error ? error.message : 'Unknown error'}`
						}]
					};
				}
			}
		);

		// Tool 2: Component Explorer
		this.server.tool(
			"explore_reablocks_components",
			{
				category: z.enum(['Elements', 'Form', 'Layout', 'Layers', 'Data', 'Typography']).optional(),
				search: z.string().optional()
			},
			async ({ category, search }) => {
				try {
					let components = Object.values(ENHANCED_REABLOCKS_COMPONENTS);

					if (category) {
						components = components.filter(c => c.category === category);
					}

					if (search) {
						const searchLower = search.toLowerCase();
						components = components.filter(c =>
							c.name.toLowerCase().includes(searchLower) ||
							c.description.toLowerCase().includes(searchLower) ||
							c.useCases.some(use => use.toLowerCase().includes(searchLower))
						);
					}

					const componentList = components.map(comp => `## ${comp.name}
**Category**: ${comp.category}
**Description**: ${comp.description}

**Key Props**:
${comp.props.slice(0, 4).map(prop => `- **${prop.name}** (${prop.type}): ${prop.description}`).join('\n')}

**Use Cases**: ${comp.useCases.join(', ')}
**Related**: ${comp.relatedComponents.join(', ')}

**Example**:
\`\`\`tsx
${comp.examples[0]?.code || `<${comp.name}>Content</${comp.name}>`}
\`\`\`
`).join('\n---\n');

					return {
						content: [{
							type: "text",
							text: `# Reablocks Component Explorer

Found ${components.length} components${category ? ` in ${category}` : ''}${search ? ` matching "${search}"` : ''}.

${componentList}`
						}]
					};
				} catch (error) {
					return {
						content: [{
							type: "text",
							text: `Error: ${error instanceof Error ? error.message : 'Unknown error'}`
						}]
					};
				}
			}
		);

		// Tool 3: Natural Language Component Query
		this.server.tool(
			"ask_about_components",
			{
				question: z.string().describe("Ask questions about Reablocks components in natural language")
			},
			async ({ question }) => {
				try {
					const request = this.nlp.parseRequest(question);
					const suggestedComponents = this.nlp.suggestComponents(question);

					const relevantComponents = suggestedComponents
						.map(name => ENHANCED_REABLOCKS_COMPONENTS[name])
						.filter(Boolean);

					let response = `# Answer to: "${question}"\n\n`;

					if (relevantComponents.length > 0) {
						response += `## Suggested Components\n\n`;

						relevantComponents.forEach(comp => {
							response += `### ${comp.name}
${comp.description}

**Perfect for**: ${comp.useCases.join(', ')}

**Quick Example**:
\`\`\`tsx
${comp.examples[0]?.code || `<${comp.name} />`}
\`\`\`

`;
						});

						response += `## Complete Example\n\n`;
						if (request.type === 'form') {
							response += `Here's a complete form example using the suggested components:

\`\`\`tsx
import { ${suggestedComponents.join(', ')} } from 'reablocks';

export const ExampleForm = () => {
  const [formData, setFormData] = useState({});
  
  return (
    <Card>
      <Stack spacing="lg">
        <Input placeholder="Name" />
        <Input type="email" placeholder="Email" />
        <Button color="primary">Submit</Button>
      </Stack>
    </Card>
  );
};
\`\`\``;
						} else if (request.type === 'dashboard') {
							response += `Here's a dashboard example:

\`\`\`tsx
import { ${suggestedComponents.join(', ')} } from 'reablocks';

export const ExampleDashboard = () => (
  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
    <Card><DataSize value={1024000} /></Card>
    <Card><Button>Action</Button></Card>
    <Card>Content</Card>
  </div>
);
\`\`\``;
						}
					} else {
						response += `I didn't find specific components matching your question, but here are some general recommendations:

- For **forms**: Use Input, Select, Button, Checkbox, Radio
- For **data display**: Use Card, DataSize, DateFormat, Table components  
- For **navigation**: Use Menu, Breadcrumbs, Tabs
- For **feedback**: Use Notification, Dialog, Badge
- For **layout**: Use Stack, Card, Divider

Would you like me to generate a specific example for any of these?`;
					}

					return {
						content: [{ type: "text", text: response }]
					};
				} catch (error) {
					return {
						content: [{
							type: "text",
							text: `Error: ${error instanceof Error ? error.message : 'Unknown error'}`
						}]
					};
				}
			}
		);

		// Tool 4: Component Documentation
		this.server.tool(
			"get_component_documentation",
			{
				componentName: z.string().describe("Name of the Reablocks component to get documentation for")
			},
			async ({ componentName }) => {
				try {
					const component = ENHANCED_REABLOCKS_COMPONENTS[componentName];

					if (!component) {
						const available = Object.keys(ENHANCED_REABLOCKS_COMPONENTS).join(', ');
						return {
							content: [{
								type: "text",
								text: `Component "${componentName}" not found. Available components: ${available}`
							}]
						};
					}

					const documentation = `# ${component.name} Documentation

## Overview
${component.description}

**Category**: ${component.category}

## Props

| Name | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
${component.props.map(prop =>
						`| ${prop.name} | \`${prop.type}\` | ${prop.required ? '✅' : '❌'} | ${prop.defaultValue || '-'} | ${prop.description} |`
					).join('\n')}

## Examples

${component.examples.map((example, i) => `### ${example.title}
${example.description}

\`\`\`tsx
${example.code}
\`\`\`
`).join('\n')}

## Use Cases
${component.useCases.map(use => `- ${use}`).join('\n')}

## Related Components
${component.relatedComponents.map(comp => `- ${comp}`).join('\n')}

## Variants
${component.variants.map(variant => `- \`${variant}\``).join('\n')}

---
*Part of the Reablocks component library*`;

					return {
						content: [{ type: "text", text: documentation }]
					};
				} catch (error) {
					return {
						content: [{
							type: "text",
							text: `Error: ${error instanceof Error ? error.message : 'Unknown error'}`
						}]
					};
				}
			}
		);

		// Tool 5: List All Components
		this.server.tool(
			"list_all_components",
			{},
			async () => {
				try {
					const components = Object.values(ENHANCED_REABLOCKS_COMPONENTS);
					const byCategory = components.reduce((acc, comp) => {
						if (!acc[comp.category]) acc[comp.category] = [];
						acc[comp.category].push(comp);
						return acc;
					}, {} as Record<string, ComponentSchema[]>);

					let response = `# All Reablocks Components (${components.length} total)\n\n`;

					Object.entries(byCategory).forEach(([category, comps]) => {
						response += `## ${category} (${comps.length})\n\n`;
						comps.forEach(comp => {
							response += `### ${comp.name}
${comp.description}
**Use for**: ${comp.useCases.slice(0, 2).join(', ')}

`;
						});
					});

					response += `\n## Quick Usage Examples

\`\`\`tsx
// Basic button
<Button color="primary">Click me</Button>

// Form input
<Input placeholder="Enter text" />

// Card container
<Card>
  <h3>Title</h3>
  <p>Content</p>
</Card>

// Data display
<DataSize value={1048576} /> // Shows "1 MB"

// Layout stack
<Stack spacing="lg">
  <Button>First</Button>
  <Button>Second</Button>
</Stack>
\`\`\``;

					return {
						content: [{ type: "text", text: response }]
					};
				} catch (error) {
					return {
						content: [{
							type: "text",
							text: `Error: ${error instanceof Error ? error.message : 'Unknown error'}`
						}]
					};
				}
			}
		);

		// Tool 6: Get Examples and Learning Materials
		this.server.tool(
			"get_examples_and_tutorials",
			{
				type: z.enum(['all', 'prompts', 'components', 'patterns', 'getting-started']).optional().default('all'),
				skill_level: z.enum(['beginner', 'intermediate', 'advanced']).optional().default('beginner')
			},
			async ({ type, skill_level }) => {
				try {
					let content = '';

					if (type === 'all' || type === 'getting-started') {
						content += `# 🚀 Getting Started with Enhanced Reablocks MCP Server

## What is this MCP Server?
This server helps you generate React components using Reablocks (a modern component library) through natural language. Just describe what you want, and get production-ready code!

## 🎯 Quick Start Examples

### 1. Your First Component
Try this prompt:
\`\`\`
"Create a simple button that says Hello World"
\`\`\`

### 2. Build a Contact Form  
Try this prompt:
\`\`\`
"I need a contact form with name, email, and message fields"
\`\`\`

### 3. Create a Dashboard
Try this prompt:
\`\`\`
"Generate a dashboard with user statistics and action buttons"
\`\`\`

---

`;
					}

					if (type === 'all' || type === 'prompts') {
						content += `# 💬 Example Prompts to Try

## 🔰 Beginner Prompts
${skill_level === 'beginner' ? '**👈 Perfect for you!**' : ''}

### Simple Components
- "Create a blue button"
- "Make an input field for email"
- "Show me a card component"
- "I need a simple form"

### Basic Layouts
- "Create a form with two buttons"
- "Make a card with a title and content"
- "Show me a navigation menu"

## 🚀 Intermediate Prompts
${skill_level === 'intermediate' ? '**👈 Perfect for you!**' : ''}

### Forms and Validation
- "Create a login form with email and password validation"
- "I need a registration form with multiple fields and error handling"
- "Build a contact form that shows success/error messages"

### Data Display
- "Create a data table with search and sorting"
- "Show me components for displaying file sizes and dates"
- "I need a dashboard with metrics cards"

### Interactive Components
- "Create a multi-step form with navigation"
- "Build a sidebar with collapsible menu items"
- "Make a modal dialog for editing user profiles"

## 🎖️ Advanced Prompts
${skill_level === 'advanced' ? '**👈 Perfect for you!**' : ''}

### Complex Dashboards
- "Generate an admin dashboard with user management, analytics cards, and data tables with filtering"
- "Create a project management dashboard with task lists, progress indicators, and team member avatars"
- "Build a e-commerce admin panel with product listings, order management, and sales metrics"

### Specialized Components
- "Create a file upload component with drag-and-drop, progress indicators, and file type validation"
- "Build a data visualization dashboard with interactive charts and filtering controls"
- "Generate a real-time messaging interface with user status, message history, and typing indicators"

---

`;
					}

					if (type === 'all' || type === 'components') {
						content += `# 🧩 Component Discovery Examples

## Finding the Right Components

### By Purpose
Ask: \`"What components should I use for..."\`
- "...displaying user information?" → Avatar, Card, Badge
- "...creating forms?" → Input, Select, Button, Checkbox
- "...showing data?" → DataSize, DateFormat, Table components
- "...navigation?" → Menu, Breadcrumbs, Tabs

### By Category
Use: \`explore_reablocks_components\` tool
- \`category: "Form"\` - All form-related components
- \`category: "Layout"\` - Cards, Stack, Divider, etc.
- \`category: "Data"\` - DataSize, Pager, Sort, etc.

### By Search
Use: \`explore_reablocks_components\` tool
- \`search: "button"\` - Finds Button, IconButton, etc.
- \`search: "input"\` - Finds Input, Select, Textarea, etc.
- \`search: "data"\` - Finds DataSize, DateFormat, etc.

## Component Documentation
Get detailed info: \`get_component_documentation\`
- \`componentName: "Button"\` - Complete Button documentation
- \`componentName: "Input"\` - All Input props and examples
- \`componentName: "Card"\` - Card usage patterns

---

`;
					}

					if (type === 'all' || type === 'patterns') {
						content += `# 📋 Common UI Patterns

## Authentication Patterns

### Login Form
\`\`\`
"Create a login form with email, password, remember me checkbox, and forgot password link"
\`\`\`

### Registration Form
\`\`\`
"Build a registration form with validation, terms agreement, and success confirmation"
\`\`\`

## Dashboard Patterns

### Analytics Dashboard
\`\`\`
"Generate a dashboard with KPI cards, charts, recent activity table, and quick actions"
\`\`\`

### Admin Panel
\`\`\`
"Create an admin panel with user management table, search, filters, and batch actions"
\`\`\`

## Data Management Patterns

### CRUD Interface
\`\`\`
"Build a user management interface with create, edit, delete, and search functionality"
\`\`\`

### Data Table
\`\`\`
"Create a data table with sorting, filtering, pagination, and row selection"
\`\`\`

## Form Patterns

### Multi-Step Form
\`\`\`
"Create a multi-step checkout form with progress indicator and navigation"
\`\`\`

### Dynamic Form
\`\`\`
"Build a form that adds/removes fields dynamically with validation"
\`\`\`

## Layout Patterns

### Sidebar Layout
\`\`\`
"Create a layout with collapsible sidebar navigation and main content area"
\`\`\`

### Card Grid
\`\`\`
"Generate a responsive grid of cards showing product information"
\`\`\`

---

`;
					}

					content += `# 🎓 Learning Tips

## Start Simple
1. Begin with single component requests
2. Gradually combine multiple components  
3. Add complexity like validation and state management

## Experiment with Language
- Be descriptive: "Create a blue primary button with large size"
- Use UI terms: "dashboard", "form", "table", "navigation"
- Specify requirements: "with validation", "responsive", "accessible"

## Iterate and Refine
1. Start with a basic prompt
2. Ask for specific modifications
3. Request additional features
4. Combine multiple components

## Get Help Anytime
- \`ask_about_components\` - Ask questions in natural language
- \`list_all_components\` - See everything available  
- \`get_component_documentation\` - Deep dive into specific components

---

# 🎉 Ready to Start?

Try your first prompt now! Here are some suggestions:

**For Beginners:**
- "Create a simple contact form"
- "Show me a button with different colors"
- "Make a card component with a title"

**For Developers:**  
- "Generate a user dashboard with metrics"
- "Create a data table with search functionality"
- "Build a modal dialog for editing profiles"

**For Designers:**
- "Create a landing page hero section"
- "Build a pricing table with feature comparison"
- "Generate a testimonial card grid"

Happy building! 🚀`;

					return {
						content: [{ type: "text", text: content }]
					};
				} catch (error) {
					return {
						content: [{
							type: "text",
							text: `Error: ${error instanceof Error ? error.message : 'Unknown error'}`
						}]
					};
				}
			}
		);


	}
}

export default {
	fetch(request: Request, env: Env, ctx: ExecutionContext) {
		const url = new URL(request.url);

		if (url.pathname === "/sse" || url.pathname === "/sse/message") {
			return MyMCP.serveSSE("/sse").fetch(request, env, ctx);
		}

		if (url.pathname === "/mcp") {
			return MyMCP.serve("/mcp").fetch(request, env, ctx);
		}

		return new Response("Not found", { status: 404 });
	},
};