.PHONY: help dev prod down build test test-backend test-e2e migrate seed logs

help: ## Show this help
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-15s\033[0m %s\n", $$1, $$2}'

# === Development ===

dev: ## Start development environment (hot reload)
	docker compose -f docker-compose.yml -f docker-compose.dev.yml up --build

prod: ## Start production environment
	docker compose -f docker-compose.prod.yml up --build --force-recreate -d

down: ## Stop all containers
	docker compose down

build: ## Build all Docker images
	docker compose build

logs: ## View container logs
	docker compose logs -f

# === Database ===

migrate: ## Run Django migrations
	docker compose exec backend python manage.py migrate

seed: ## Seed database with sample data
	docker compose exec backend python manage.py seed_courses
	docker compose exec backend python manage.py seed_events
	docker compose exec backend python manage.py seed_programs
	docker compose exec backend python manage.py seed_showcase
	docker compose exec backend python manage.py seed_careers

createsuperuser: ## Create Django admin superuser
	docker compose exec backend python manage.py createsuperuser

# === Testing ===

test: test-backend ## Run all tests

test-backend: ## Run backend pytest suite
	cd algonex-backend && python3.11 -m pytest -v

test-e2e: ## Run Playwright E2E tests
	cd algonex-frontend && npx playwright test

test-docker: ## Run tests inside Docker
	docker compose -f docker-compose.yml -f docker-compose.test.yml up --build --abort-on-container-exit

# === Utilities ===

shell: ## Open Django shell
	docker compose exec backend python manage.py shell

clean: ## Remove all containers, volumes, and images
	docker compose down -v --rmi local
