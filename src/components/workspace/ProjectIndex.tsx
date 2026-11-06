import React from 'react'
import { ArrowRightIcon } from '../icons/WorkspaceIcons'
import type { ProjectExperienceEntry, ProjectId } from '../../data/portfolioData'

interface ProjectIndexItemProps {
  project: ProjectExperienceEntry
  openAriaLabel: string
  openLabel: string
  onSelectProject: (projectId: ProjectId) => void
}

export const ProjectIndexItem: React.FC<ProjectIndexItemProps> = ({
  project,
  openAriaLabel,
  openLabel,
  onSelectProject,
}) => {
  return (
    <li className="project-index-item">
      <button
        type="button"
        className="project-index-row"
        aria-label={openAriaLabel}
        onClick={() => onSelectProject(project.id)}
      >
        <div className="project-index-left">
          <span className="project-index-number" aria-hidden="true">
            {project.number}
          </span>
          <span className="project-index-divider" aria-hidden="true">
            —
          </span>
          <span className="project-index-name">{project.brandName}</span>
        </div>

        <div className="project-index-right" aria-hidden="true">
          <span className="project-index-cta-text">{openLabel}</span>
          <span className="project-index-arrow">
            <ArrowRightIcon size={20} />
          </span>
        </div>
      </button>
    </li>
  )
}

interface ProjectIndexProps {
  projects: ReadonlyArray<ProjectExperienceEntry>
  openLabel: string
  getOpenAriaLabel: (projectName: string) => string
  onSelectProject: (projectId: ProjectId) => void
}

export const ProjectIndex: React.FC<ProjectIndexProps> = ({
  projects,
  openLabel,
  getOpenAriaLabel,
  onSelectProject,
}) => {
  return (
    <ol className="project-index-list">
      {projects.map((proj) => (
        <ProjectIndexItem
          key={proj.id}
          project={proj}
          openLabel={openLabel}
          openAriaLabel={getOpenAriaLabel(proj.brandName)}
          onSelectProject={onSelectProject}
        />
      ))}
    </ol>
  )
}
