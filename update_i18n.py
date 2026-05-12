import json

files = ['src/translations/en.json', 'src/translations/id.json', 'src/translations/zh.json']
data = {
    'src/translations/en.json': {
        "sample_review": "📊 Review",
        "sample_feature": "🆕 New Feature",
        "sample_solution": "💡 Solution"
    },
    'src/translations/id.json': {
        "sample_review": "📊 Review",
        "sample_feature": "🆕 Fitur Baru",
        "sample_solution": "💡 Solusi"
    },
    'src/translations/zh.json': {
        "sample_review": "📊 测评",
        "sample_feature": "🆕 功能上新",
        "sample_solution": "💡 解决方案"
    }
}

for file in files:
    with open(file, 'r', encoding='utf-8') as f:
        content = json.load(f)

    # Remove use_sample
    if 'use_sample' in content['buttons']:
        del content['buttons']['use_sample']

    # Add new keys
    for key, value in data[file].items():
        content['buttons'][key] = value

    with open(file, 'w', encoding='utf-8') as f:
        json.dump(content, f, ensure_ascii=False, indent=2)
