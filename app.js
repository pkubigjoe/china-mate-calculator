// Chinese Mate Calculator App
class MateCalculator {
    constructor() {
        this.cityData = null;
        this.demographicStats = null;
        this.form = document.getElementById('mate-form');
        this.resultsCard = document.getElementById('results-card');
        this.loadingCard = document.getElementById('loading-card');
        this.percentageNumber = document.getElementById('percentage-number');
        this.absoluteNumber = document.getElementById('absolute-number');
        this.analysisContent = document.getElementById('analysis-content');
        this.suggestionContent = document.getElementById('suggestion-content');
        this.resetBtn = document.getElementById('reset-btn');
        
        this.init();
    }

    async init() {
        await this.loadData();
        this.setupEventListeners();
        this.setupFormValidation();
    }

    async loadData() {
        // Use fallback data directly since external file may not load
        this.cityData = [
            {"city": "北京", "tier": 1, "population": 21843000, "avg_income": 77415},
            {"city": "上海", "tier": 1, "population": 24759000, "avg_income": 79610},
            {"city": "广州", "tier": 1, "population": 18676000, "avg_income": 75000},
            {"city": "深圳", "tier": 1, "population": 17685000, "avg_income": 73000},
            {"city": "天津", "tier": 2, "population": 13630000, "avg_income": 45000},
            {"city": "重庆", "tier": 2, "population": 32133000, "avg_income": 34000},
            {"city": "苏州", "tier": 2, "population": 12750000, "avg_income": 70819},
            {"city": "成都", "tier": 2, "population": 20938000, "avg_income": 48000},
            {"city": "武汉", "tier": 2, "population": 13648000, "avg_income": 52000},
            {"city": "杭州", "tier": 2, "population": 12204000, "avg_income": 68666},
            {"city": "西安", "tier": 2, "population": 12953000, "avg_income": 45000},
            {"city": "南京", "tier": 2, "population": 9423000, "avg_income": 65000},
            {"city": "青岛", "tier": 2, "population": 10257000, "avg_income": 50000},
            {"city": "长沙", "tier": 2, "population": 10474000, "avg_income": 58850},
            {"city": "宁波", "tier": 2, "population": 9540000, "avg_income": 62000},
            {"city": "郑州", "tier": 2, "population": 12742000, "avg_income": 42000},
            {"city": "沈阳", "tier": 2, "population": 9070000, "avg_income": 40000},
            {"city": "东莞", "tier": 2, "population": 10466000, "avg_income": 48000},
            {"city": "昆明", "tier": 2, "population": 8460000, "avg_income": 38000},
            {"city": "大连", "tier": 2, "population": 7450000, "avg_income": 42000}
        ];
        
        this.demographicStats = {
            "age_distribution": {
                "20-24": 0.052,
                "25-29": 0.065,
                "30-34": 0.088,
                "35-39": 0.075,
                "40-44": 0.072
            },
            "education_distribution": {
                "高中及以下": 0.65,
                "大专": 0.12,
                "本科": 0.18,
                "硕士": 0.045,
                "博士": 0.005
            },
            "income_distribution": {
                "一线城市": {
                    "3万以下": 0.15,
                    "3-5万": 0.18,
                    "5-10万": 0.32,
                    "10-20万": 0.23,
                    "20-50万": 0.10,
                    "50万以上": 0.02
                },
                "二线城市": {
                    "3万以下": 0.25,
                    "3-5万": 0.28,
                    "5-10万": 0.30,
                    "10-20万": 0.13,
                    "20-50万": 0.035,
                    "50万以上": 0.005
                }
            },
            "housing_ownership": {
                "一线城市": {
                    "有房": 0.45,
                    "无房": 0.55
                },
                "二线城市": {
                    "有房": 0.62,
                    "无房": 0.38
                }
            },
            "marriage_status": {
                "未婚": 0.28,
                "已婚": 0.65,
                "离异": 0.065,
                "丧偶": 0.005
            }
        };
        
        console.log('Data loaded successfully');
    }

    setupEventListeners() {
        this.form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.calculateMatch();
        });

        this.resetBtn.addEventListener('click', () => {
            this.resetForm();
        });

        // Real-time calculation on key form changes
        const keyFields = ['city', 'income', 'education'];
        keyFields.forEach(fieldName => {
            const field = this.form.querySelector(`[name="${fieldName}"]`);
            if (field) {
                field.addEventListener('change', () => {
                    if (this.isFormValid()) {
                        this.calculateMatch();
                    }
                });
            }
        });
    }

    setupFormValidation() {
        const requiredFields = this.form.querySelectorAll('[required]');
        requiredFields.forEach(field => {
            field.addEventListener('blur', () => {
                this.validateField(field);
            });
        });
    }

    validateField(field) {
        if (!field.value) {
            field.style.borderColor = 'var(--color-error)';
            return false;
        } else {
            field.style.borderColor = 'var(--color-border)';
            return true;
        }
    }

    isFormValid() {
        const requiredFields = this.form.querySelectorAll('[required]');
        const isValid = Array.from(requiredFields).every(field => field.value);
        console.log('Form validation result:', isValid);
        return isValid;
    }

    async calculateMatch() {
        console.log('Starting calculation...');
        
        if (!this.isFormValid()) {
            console.log('Form is not valid');
            alert('请填写所有必需的字段');
            return;
        }

        this.showLoading();
        
        // Simulate calculation delay for better UX
        setTimeout(() => {
            try {
                const formData = new FormData(this.form);
                const criteria = this.parseFormData(formData);
                console.log('Parsed criteria:', criteria);
                
                const result = this.performCalculation(criteria);
                console.log('Calculation result:', result);
                
                this.displayResults(result, criteria);
            } catch (error) {
                console.error('Calculation error:', error);
                this.hideLoading();
                alert('计算过程中出现错误，请重试');
            }
        }, 1000);
    }

    parseFormData(formData) {
        const criteria = {
            userGender: formData.get('userGender') || '',
            targetGender: formData.get('targetGender') || '',
            ageMin: parseInt(formData.get('ageMin')) || 25,
            ageMax: parseInt(formData.get('ageMax')) || 35,
            heightMin: parseInt(formData.get('heightMin')) || 165,
            city: formData.get('city') || '',
            acceptRemote: formData.get('acceptRemote') === 'yes',
            income: formData.get('income') || '不要求',
            housing: formData.get('housing') || '不要求',
            education: formData.get('education') || '不要求',
            maritalStatus: formData.get('maritalStatus') || '未婚'
        };
        
        console.log('Form data parsed:', criteria);
        return criteria;
    }

    performCalculation(criteria) {
        console.log('Performing calculation with criteria:', criteria);
        
        const cityInfo = this.cityData.find(city => city.city === criteria.city);
        if (!cityInfo) {
            throw new Error('City not found: ' + criteria.city);
        }
        
        const cityTier = cityInfo.tier === 1 ? '一线城市' : '二线城市';
        
        let matchProbability = 1.0;
        const factors = [];

        // Age factor
        const ageFactor = this.calculateAgeFactor(criteria.ageMin, criteria.ageMax);
        matchProbability *= ageFactor.probability;
        factors.push({
            name: '年龄范围',
            impact: ageFactor.probability,
            description: `${criteria.ageMin}-${criteria.ageMax}岁范围的人群占比${(ageFactor.probability * 100).toFixed(1)}%`
        });

        // Education factor
        if (criteria.education !== '不要求') {
            const educationFactor = this.calculateEducationFactor(criteria.education);
            matchProbability *= educationFactor.probability;
            factors.push({
                name: '学历要求',
                impact: educationFactor.probability,
                description: `${criteria.education}及以上学历人群占比${(educationFactor.probability * 100).toFixed(1)}%`
            });
        }

        // Income factor
        if (criteria.income !== '不要求') {
            const incomeFactor = this.calculateIncomeFactor(criteria.income, cityTier);
            matchProbability *= incomeFactor.probability;
            factors.push({
                name: '收入要求',
                impact: incomeFactor.probability,
                description: `${criteria.income}收入人群在${cityTier}占比${(incomeFactor.probability * 100).toFixed(1)}%`
            });
        }

        // Housing factor
        if (criteria.housing !== '不要求') {
            const housingFactor = this.calculateHousingFactor(criteria.housing, cityTier);
            matchProbability *= housingFactor.probability;
            factors.push({
                name: '房产要求',
                impact: housingFactor.probability,
                description: `符合房产要求的人群占比${(housingFactor.probability * 100).toFixed(1)}%`
            });
        }

        // Marital status factor
        const maritalFactor = this.calculateMaritalStatusFactor(criteria.maritalStatus);
        matchProbability *= maritalFactor.probability;
        factors.push({
            name: '婚姻状态',
            impact: maritalFactor.probability,
            description: `符合婚姻状态要求的人群占比${(maritalFactor.probability * 100).toFixed(1)}%`
        });

        // Gender factor (assume roughly 50/50 split)
        matchProbability *= 0.5;
        factors.push({
            name: '性别筛选',
            impact: 0.5,
            description: '目标性别人群占总人口50%'
        });

        // Calculate absolute numbers
        const percentage = matchProbability * 100;
        const absoluteCount = Math.round(cityInfo.population * matchProbability);

        const result = {
            percentage: Math.max(0.001, percentage), // Minimum 0.001%
            absoluteCount: Math.max(1, absoluteCount), // Minimum 1 person
            factors,
            cityInfo,
            cityTier
        };
        
        console.log('Calculation completed:', result);
        return result;
    }

    calculateAgeFactor(minAge, maxAge) {
        let probability = 0;
        const ageRanges = this.demographicStats.age_distribution;
        
        // Simple approximation: if age range overlaps with demographic ranges
        if (minAge <= 29 && maxAge >= 20) probability += ageRanges["20-24"];
        if (minAge <= 29 && maxAge >= 25) probability += ageRanges["25-29"];
        if (minAge <= 34 && maxAge >= 30) probability += ageRanges["30-34"];
        if (minAge <= 39 && maxAge >= 35) probability += ageRanges["35-39"];
        if (minAge <= 44 && maxAge >= 40) probability += ageRanges["40-44"];

        return {
            probability: Math.min(Math.max(probability, 0.1), 1.0) // Between 10% and 100%
        };
    }

    calculateEducationFactor(requiredEducation) {
        const educationLevels = ['高中及以下', '大专', '本科', '硕士', '博士'];
        const requiredIndex = educationLevels.indexOf(requiredEducation);
        
        if (requiredIndex === -1) return { probability: 1.0 };
        
        let probability = 0;
        for (let i = requiredIndex; i < educationLevels.length; i++) {
            probability += this.demographicStats.education_distribution[educationLevels[i]] || 0;
        }

        return {
            probability: Math.max(probability, 0.01) // Minimum 1%
        };
    }

    calculateIncomeFactor(requiredIncome, cityTier) {
        const incomeDistribution = this.demographicStats.income_distribution[cityTier];
        const incomeLevels = ['3万以下', '3-5万', '5-10万', '10-20万', '20-50万', '50万以上'];
        const requiredIndex = incomeLevels.indexOf(requiredIncome);

        if (requiredIndex === -1) return { probability: 1.0 };

        let probability = 0;
        for (let i = requiredIndex; i < incomeLevels.length; i++) {
            probability += incomeDistribution[incomeLevels[i]] || 0;
        }

        return {
            probability: Math.max(probability, 0.005) // Minimum 0.5%
        };
    }

    calculateHousingFactor(housingRequirement, cityTier) {
        const housingData = this.demographicStats.housing_ownership[cityTier];
        
        switch (housingRequirement) {
            case '有房':
                return { probability: housingData['有房'] };
            case '无房但有购房能力':
                return { probability: housingData['无房'] * 0.3 }; // Assume 30% of renters have buying power
            case '无房':
                return { probability: housingData['无房'] };
            default:
                return { probability: 1.0 };
        }
    }

    calculateMaritalStatusFactor(requiredStatus) {
        const maritalData = this.demographicStats.marriage_status;
        
        switch (requiredStatus) {
            case '未婚':
                return { probability: maritalData['未婚'] };
            case '离异可接受':
                return { probability: maritalData['未婚'] + maritalData['离异'] };
            default:
                return { probability: 0.35 }; // Combined unmarried + divorced
        }
    }

    showLoading() {
        this.resultsCard.style.display = 'none';
        this.loadingCard.style.display = 'block';
        console.log('Showing loading...');
    }

    hideLoading() {
        this.loadingCard.style.display = 'none';
        console.log('Hiding loading...');
    }

    displayResults(result, criteria) {
        console.log('Displaying results:', result);
        
        this.hideLoading();
        this.resultsCard.style.display = 'block';

        // Animate percentage
        this.animateNumber(result.percentage);
        this.absoluteNumber.textContent = result.absoluteCount.toLocaleString();

        // Generate analysis
        this.generateAnalysis(result);
        
        // Generate suggestions
        this.generateSuggestions(result, criteria);

        // Scroll to results
        setTimeout(() => {
            this.resultsCard.scrollIntoView({ behavior: 'smooth' });
        }, 100);
    }

    animateNumber(targetPercentage) {
        const duration = 1500;
        const startTime = performance.now();
        const startValue = 0;
        
        const animate = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // Easing function
            const easeOut = 1 - Math.pow(1 - progress, 3);
            const currentValue = startValue + (targetPercentage - startValue) * easeOut;
            
            this.percentageNumber.textContent = currentValue.toFixed(3);
            
            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        };
        
        requestAnimationFrame(animate);
        this.percentageNumber.classList.add('animate');
    }

    generateAnalysis(result) {
        const { factors } = result;
        
        // Sort factors by impact (most limiting first)
        const sortedFactors = [...factors].sort((a, b) => a.impact - b.impact);
        
        let analysisHTML = '';
        
        sortedFactors.forEach((factor, index) => {
            const impactClass = factor.impact < 0.1 ? 'limiting-factor' : 
                               factor.impact > 0.5 ? 'positive-factor' : '';
            
            analysisHTML += `
                <div class="analysis-item ${impactClass}">
                    <strong>${factor.name}:</strong> ${factor.description}
                </div>
            `;
        });

        this.analysisContent.innerHTML = analysisHTML;
    }

    generateSuggestions(result, criteria) {
        const { percentage, factors } = result;
        let suggestions = [];

        if (percentage < 0.1) {
            suggestions.push('你的标准非常严格，符合条件的人极少。考虑适当放宽一些要求。');
            
            // Find most limiting factors
            const limitingFactors = factors.filter(f => f.impact < 0.2);
            limitingFactors.forEach(factor => {
                if (factor.name === '收入要求') {
                    suggestions.push('收入要求较高，可考虑关注潜力股或成长性。');
                }
                if (factor.name === '学历要求') {
                    suggestions.push('高学历人群较少，可考虑重视能力和品格。');
                }
                if (factor.name === '年龄范围') {
                    suggestions.push('年龄范围较窄，适当扩大可增加选择机会。');
                }
            });
        } else if (percentage < 1) {
            suggestions.push('你的标准比较合理，但仍有优化空间。');
            suggestions.push('建议在保持核心要求的同时，对次要条件保持开放态度。');
        } else if (percentage < 5) {
            suggestions.push('很好！你的择偶标准比较现实，有合理的选择范围。');
            suggestions.push('建议主动扩大社交圈，增加遇到合适对象的机会。');
        } else {
            suggestions.push('你的标准相对宽松，选择范围很大。');
            suggestions.push('可以考虑提高某些重要条件，找到更匹配的对象。');
        }

        // Add city-specific suggestions
        if (result.cityTier === '一线城市') {
            suggestions.push('一线城市竞争激烈，建议提升自身条件，或考虑二线城市机会。');
        } else {
            suggestions.push('二线城市生活成本较低，是不错的选择。');
        }

        let suggestionHTML = '';
        suggestions.forEach(suggestion => {
            suggestionHTML += `<div class="suggestion-item">${suggestion}</div>`;
        });

        this.suggestionContent.innerHTML = suggestionHTML;
    }

    resetForm() {
        this.form.reset();
        this.resultsCard.style.display = 'none';
        this.loadingCard.style.display = 'none';
        
        // Reset form field styles
        const fields = this.form.querySelectorAll('.form-control');
        fields.forEach(field => {
            field.style.borderColor = 'var(--color-border)';
        });

        // Set default values
        this.form.querySelector('[name="ageMin"]').value = '25';
        this.form.querySelector('[name="ageMax"]').value = '35';
        this.form.querySelector('[name="heightMin"]').value = '165';
        this.form.querySelector('[name="acceptRemote"]').value = 'no';
        this.form.querySelector('[name="income"]').value = '不要求';
        this.form.querySelector('[name="housing"]').value = '不要求';
        this.form.querySelector('[name="education"]').value = '不要求';
        this.form.querySelector('[name="maritalStatus"]').value = '未婚';
        
        console.log('Form reset completed');
    }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded, initializing app...');
    new MateCalculator();
});

// Add some utility functions for better UX
document.addEventListener('DOMContentLoaded', () => {
    // Add hover effects to form groups
    const formGroups = document.querySelectorAll('.form-group');
    formGroups.forEach(group => {
        const input = group.querySelector('.form-control');
        if (input) {
            input.addEventListener('focus', () => {
                group.style.transform = 'translateY(-1px)';
                group.style.transition = 'transform 0.2s ease';
            });
            
            input.addEventListener('blur', () => {
                group.style.transform = 'translateY(0)';
            });
        }
    });
});