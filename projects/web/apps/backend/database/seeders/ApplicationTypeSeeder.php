<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ApplicationTypeSeeder extends Seeder
{
    public function run(): void
    {
        $applicationTypes = [
            // Software Development (25 tipos)
            ['service_slug' => 'software-development', 'name' => 'Web Applications', 'sort' => 1],
            ['service_slug' => 'software-development', 'name' => 'Mobile Apps', 'sort' => 2],
            ['service_slug' => 'software-development', 'name' => 'Desktop Applications', 'sort' => 3],
            ['service_slug' => 'software-development', 'name' => 'API Development', 'sort' => 4],
            ['service_slug' => 'software-development', 'name' => 'Microservices', 'sort' => 5],
            ['service_slug' => 'software-development', 'name' => 'E-commerce Platforms', 'sort' => 6],
            ['service_slug' => 'software-development', 'name' => 'CMS Development', 'sort' => 7],
            ['service_slug' => 'software-development', 'name' => 'Portal Development', 'sort' => 8],
            ['service_slug' => 'software-development', 'name' => 'Database Solutions', 'sort' => 9],
            ['service_slug' => 'software-development', 'name' => 'Cloud Applications', 'sort' => 10],
            ['service_slug' => 'software-development', 'name' => 'Real-time Systems', 'sort' => 11],
            ['service_slug' => 'software-development', 'name' => 'IoT Applications', 'sort' => 12],
            ['service_slug' => 'software-development', 'name' => 'Blockchain Solutions', 'sort' => 13],
            ['service_slug' => 'software-development', 'name' => 'Payment Systems', 'sort' => 14],
            ['service_slug' => 'software-development', 'name' => 'Booking Systems', 'sort' => 15],
            ['service_slug' => 'software-development', 'name' => 'Inventory Management', 'sort' => 16],
            ['service_slug' => 'software-development', 'name' => 'CRM Systems', 'sort' => 17],
            ['service_slug' => 'software-development', 'name' => 'ERP Systems', 'sort' => 18],
            ['service_slug' => 'software-development', 'name' => 'HR Management', 'sort' => 19],
            ['service_slug' => 'software-development', 'name' => 'Learning Management', 'sort' => 20],
            ['service_slug' => 'software-development', 'name' => 'Healthcare Systems', 'sort' => 21],
            ['service_slug' => 'software-development', 'name' => 'Financial Software', 'sort' => 22],
            ['service_slug' => 'software-development', 'name' => 'Logistics Software', 'sort' => 23],
            ['service_slug' => 'software-development', 'name' => 'Social Networks', 'sort' => 24],
            ['service_slug' => 'software-development', 'name' => 'Gaming Applications', 'sort' => 25],

            // SaaS Platforms (20 tipos)
            ['service_slug' => 'saas-platforms', 'name' => 'Multi-tenant Architecture', 'sort' => 1],
            ['service_slug' => 'saas-platforms', 'name' => 'Subscription Management', 'sort' => 2],
            ['service_slug' => 'saas-platforms', 'name' => 'User Management', 'sort' => 3],
            ['service_slug' => 'saas-platforms', 'name' => 'Analytics Dashboard', 'sort' => 4],
            ['service_slug' => 'saas-platforms', 'name' => 'API Integration', 'sort' => 5],
            ['service_slug' => 'saas-platforms', 'name' => 'White-label Solutions', 'sort' => 6],
            ['service_slug' => 'saas-platforms', 'name' => 'Collaboration Tools', 'sort' => 7],
            ['service_slug' => 'saas-platforms', 'name' => 'Project Management', 'sort' => 8],
            ['service_slug' => 'saas-platforms', 'name' => 'Customer Support', 'sort' => 9],
            ['service_slug' => 'saas-platforms', 'name' => 'Marketing Automation', 'sort' => 10],
            ['service_slug' => 'saas-platforms', 'name' => 'Sales CRM', 'sort' => 11],
            ['service_slug' => 'saas-platforms', 'name' => 'HR SaaS', 'sort' => 12],
            ['service_slug' => 'saas-platforms', 'name' => 'Finance SaaS', 'sort' => 13],
            ['service_slug' => 'saas-platforms', 'name' => 'Inventory SaaS', 'sort' => 14],
            ['service_slug' => 'saas-platforms', 'name' => 'E-learning Platform', 'sort' => 15],
            ['service_slug' => 'saas-platforms', 'name' => 'Healthcare SaaS', 'sort' => 16],
            ['service_slug' => 'saas-platforms', 'name' => 'Legal Tech', 'sort' => 17],
            ['service_slug' => 'saas-platforms', 'name' => 'Real Estate SaaS', 'sort' => 18],
            ['service_slug' => 'saas-platforms', 'name' => 'Restaurant Management', 'sort' => 19],
            ['service_slug' => 'saas-platforms', 'name' => 'Retail POS', 'sort' => 20],

            // Enterprise Solutions (15 tipos)
            ['service_slug' => 'enterprise-solutions', 'name' => 'Enterprise Resource Planning', 'sort' => 1],
            ['service_slug' => 'enterprise-solutions', 'name' => 'Supply Chain Management', 'sort' => 2],
            ['service_slug' => 'enterprise-solutions', 'name' => 'Business Intelligence', 'sort' => 3],
            ['service_slug' => 'enterprise-solutions', 'name' => 'Data Warehousing', 'sort' => 4],
            ['service_slug' => 'enterprise-solutions', 'name' => 'Enterprise Security', 'sort' => 5],
            ['service_slug' => 'enterprise-solutions', 'name' => 'Identity Management', 'sort' => 6],
            ['service_slug' => 'enterprise-solutions', 'name' => 'Document Management', 'sort' => 7],
            ['service_slug' => 'enterprise-solutions', 'name' => 'Workflow Automation', 'sort' => 8],
            ['service_slug' => 'enterprise-solutions', 'name' => 'Compliance Management', 'sort' => 9],
            ['service_slug' => 'enterprise-solutions', 'name' => 'Risk Management', 'sort' => 10],
            ['service_slug' => 'enterprise-solutions', 'name' => 'Asset Management', 'sort' => 11],
            ['service_slug' => 'enterprise-solutions', 'name' => 'Vendor Management', 'sort' => 12],
            ['service_slug' => 'enterprise-solutions', 'name' => 'Contract Management', 'sort' => 13],
            ['service_slug' => 'enterprise-solutions', 'name' => 'Quality Management', 'sort' => 14],
            ['service_slug' => 'enterprise-solutions', 'name' => 'Knowledge Management', 'sort' => 15],

            // AI & Automation (20 tipos)
            ['service_slug' => 'ai-automation', 'name' => 'Machine Learning Models', 'sort' => 1],
            ['service_slug' => 'ai-automation', 'name' => 'Natural Language Processing', 'sort' => 2],
            ['service_slug' => 'ai-automation', 'name' => 'Computer Vision', 'sort' => 3],
            ['service_slug' => 'ai-automation', 'name' => 'Chatbots & Virtual Assistants', 'sort' => 4],
            ['service_slug' => 'ai-automation', 'name' => 'Predictive Analytics', 'sort' => 5],
            ['service_slug' => 'ai-automation', 'name' => 'Recommendation Systems', 'sort' => 6],
            ['service_slug' => 'ai-automation', 'name' => 'Process Automation', 'sort' => 7],
            ['service_slug' => 'ai-automation', 'name' => 'Robotic Process Automation', 'sort' => 8],
            ['service_slug' => 'ai-automation', 'name' => 'Intelligent Document Processing', 'sort' => 9],
            ['service_slug' => 'ai-automation', 'name' => 'Speech Recognition', 'sort' => 10],
            ['service_slug' => 'ai-automation', 'name' => 'Sentiment Analysis', 'sort' => 11],
            ['service_slug' => 'ai-automation', 'name' => 'Fraud Detection', 'sort' => 12],
            ['service_slug' => 'ai-automation', 'name' => 'Demand Forecasting', 'sort' => 13],
            ['service_slug' => 'ai-automation', 'name' => 'Personalization Engines', 'sort' => 14],
            ['service_slug' => 'ai-automation', 'name' => 'Image Recognition', 'sort' => 15],
            ['service_slug' => 'ai-automation', 'name' => 'Video Analytics', 'sort' => 16],
            ['service_slug' => 'ai-automation', 'name' => 'Autonomous Systems', 'sort' => 17],
            ['service_slug' => 'ai-automation', 'name' => 'Smart assistants', 'sort' => 18],
            ['service_slug' => 'ai-automation', 'name' => 'Anomaly Detection', 'sort' => 19],
            ['service_slug' => 'ai-automation', 'name' => 'Optimization Algorithms', 'sort' => 20],

            // Modernization (10 tipos)
            ['service_slug' => 'modernization', 'name' => 'Legacy System Migration', 'sort' => 1],
            ['service_slug' => 'modernization', 'name' => 'Cloud Migration', 'sort' => 2],
            ['service_slug' => 'modernization', 'name' => 'Monolith to Microservices', 'sort' => 3],
            ['service_slug' => 'modernization', 'name' => 'Database Modernization', 'sort' => 4],
            ['service_slug' => 'modernization', 'name' => 'UI/UX Refresh', 'sort' => 5],
            ['service_slug' => 'modernization', 'name' => 'API Modernization', 'sort' => 6],
            ['service_slug' => 'modernization', 'name' => 'Infrastructure Upgrade', 'sort' => 7],
            ['service_slug' => 'modernization', 'name' => 'Technology Stack Update', 'sort' => 8],
            ['service_slug' => 'modernization', 'name' => 'Security Enhancement', 'sort' => 9],
            ['service_slug' => 'modernization', 'name' => 'Performance Optimization', 'sort' => 10],

            // UX Engineering (10 tipos)
            ['service_slug' => 'ux-engineering', 'name' => 'User Research', 'sort' => 1],
            ['service_slug' => 'ux-engineering', 'name' => 'Information Architecture', 'sort' => 2],
            ['service_slug' => 'ux-engineering', 'name' => 'Wireframing', 'sort' => 3],
            ['service_slug' => 'ux-engineering', 'name' => 'Prototyping', 'sort' => 4],
            ['service_slug' => 'ux-engineering', 'name' => 'Visual Design', 'sort' => 5],
            ['service_slug' => 'ux-engineering', 'name' => 'Interaction Design', 'sort' => 6],
            ['service_slug' => 'ux-engineering', 'name' => 'Usability Testing', 'sort' => 7],
            ['service_slug' => 'ux-engineering', 'name' => 'Accessibility Compliance', 'sort' => 8],
            ['service_slug' => 'ux-engineering', 'name' => 'Design Systems', 'sort' => 9],
            ['service_slug' => 'ux-engineering', 'name' => 'User Journey Mapping', 'sort' => 10],
        ];

        $services = DB::table('services')->get()->keyBy('slug');

        foreach ($applicationTypes as $type) {
            $service = $services[$type['service_slug']] ?? null;
            if (!$service) {
                echo "Servicio no encontrado: {$type['service_slug']}\n";
                continue;
            }

            DB::table('application_types')->insert([
                'service_id' => $service->id,
                'name' => $type['name'],
                'slug' => strtolower(str_replace(' ', '-', preg_replace('/[^A-Za-z0-9\s]/', '', $type['name']))),
                'description' => null,
                'is_active' => true,
                'sort_order' => $type['sort'],
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }
    }
}
