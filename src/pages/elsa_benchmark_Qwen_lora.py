from transformers import AutoTokenizer, AutoModelForCausalLM
import torch
import json, time, re
from typing import List

# 🔹 병합된 LoRA 모델 디렉토리
model_dir = "/workspace_sync/lora_finetune/lora_script/merged_qwen15b"

# 🔹 tokenizer는 원본 Qwen 모델에서 로드
tokenizer = AutoTokenizer.from_pretrained(
    "Qwen/Qwen2.5-1.5B-Instruct",
    trust_remote_code=True
)

# 🔹 병합된 모델 로딩
model = AutoModelForCausalLM.from_pretrained(
    model_dir,
    torch_dtype=torch.float16,
    device_map="auto",
    trust_remote_code=True,
    local_files_only=True
)
model.eval()

# 🔹 벤치마크 데이터 로딩
with open("/workspace_sync/ELSA_benchmark_v0.1_Cleaned.json", "r", encoding="utf-8") as f:
    dataset = json.load(f)

# 🔹 정답 추출 함수 (마지막 숫자만 추출)
def extract_answer(output_text: str) -> str:
    output_text = output_text.strip()
    matches = re.findall(r"\b[1-4]\b", output_text)
    return matches[-1] if matches else None

# 🔹 모델 질의 함수
def ask_custom_model(question_text: str, choices: List[str]) -> str:
    prompt = f"""다음 객관식 문제를 읽고 정답 번호만 숫자로 출력하세요. (예: 3)

문제: {question_text}

보기:
"""
    for i, choice in enumerate(choices, start=1):
        prompt += f"{i}. {choice}\n"
    prompt += "\n정답:"

    print("\n=== INPUT PROMPT ===")
    print(prompt)

    # 모델 입력 및 생성
    inputs = tokenizer(prompt, return_tensors="pt").to(model.device)
    with torch.no_grad():
        outputs = model.generate(
            **inputs,
            max_new_tokens=10,
            do_sample=True,
            temperature=0.7,
            top_p=0.9,
            repetition_penalty=1.1,
            eos_token_id=tokenizer.eos_token_id,
        )

    output_text = tokenizer.decode(outputs[0], skip_special_tokens=False).strip()
    print(f"\n=== Model Output ===\n{output_text}\n")

    # 정답 추출
    predicted = extract_answer(output_text)
    if not predicted:
        print(f"⚠️ 정답 추출 실패 → 원본 응답:\n{output_text}")
    return predicted

# 🔹 정확도 평가 함수
def evaluate_custom_model(model_label: str):
    correct, total = 0, 0
    print(f"\n== 평가 시작: {model_label} ==")

    for item in dataset:
        q, c, a = item["question"], item["choices"], item["answer"]
        pred = ask_custom_model(q, c)
        if pred == a:
            correct += 1
        total += 1
        time.sleep(0.05)

    acc = correct / total * 100
    print(f"\n== {model_label} 정확도: {acc:.2f}% ({correct}/{total}) ==")

# 🔹 실행
if __name__ == "__main__":
    evaluate_custom_model("Qwen2.5-1.5B 병합 LoRA 모델")
